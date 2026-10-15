"""Shared RunPod endpoint for remote Atlas, Forge and Nebula inference."""
import math
import os
import requests

OLLAMA_BASE = os.environ.get('OLLAMA_URL', 'http://127.0.0.1:11434').rstrip('/')
MODELS = {name: os.environ.get(f'XALME_{name.upper()}_MODEL', f'xalme-{name}')
          for name in ('atlas', 'forge', 'nebula')}


def number(value, default, minimum, maximum):
    value = default if value is None else float(value)
    if not math.isfinite(value):
        raise ValueError('Non-finite parameter')
    return max(minimum, min(value, maximum))


def model_info(name):
    response = requests.post(f'{OLLAMA_BASE}/api/show', json={'model': MODELS[name]}, timeout=15)
    response.raise_for_status()
    data = response.json()
    capacities = [int(v) for k, v in data.get('model_info', {}).items() if k.endswith('.context_length')]
    maximum = min(capacities) if capacities else 4096
    configured = int(os.environ.get(f'XALME_{name.upper()}_CONTEXT', '32768'))
    return {'id': name, 'name': name.title(), 'context_window': max(1024, min(maximum, configured)),
            'thinking': 'thinking' in data.get('capabilities', []), 'tools': 'tools' in data.get('capabilities', [])}


def handler(job):
    body = job.get('input', {})
    try:
        if body.get('action') == 'models':
            models = []
            for name in MODELS:
                try:
                    models.append({**model_info(name), 'available': True})
                except (requests.RequestException, ValueError, KeyError, TypeError):
                    models.append({'id': name, 'name': name.title(), 'available': False})
            return {'models': models, 'limits': {'five_hour': None, 'weekly': None}}
        name = str(body.get('model', 'atlas')).lower()
        if name not in MODELS:
            return {'error': 'Unknown Xalme model', 'status': 400}
        messages = body.get('messages')
        if not isinstance(messages, list) or not messages or len(messages) > 200:
            return {'error': 'A non-empty messages array (at most 200 entries) is required', 'status': 400}
        for message in messages:
            if not isinstance(message, dict) or message.get('role') not in ('system', 'user', 'assistant', 'tool') or not isinstance(message.get('content', ''), str):
                return {'error': 'Invalid chat message', 'status': 400}
        info = model_info(name)
        tokens = int(number(body.get('max_new_tokens'), 1536, 1, 8192))
        prompt_chars = sum(len(m.get('content', '')) for m in messages)
        if prompt_chars > 4_000_000:
            return {'error': 'Conversation is too large', 'status': 413}
        # Conservative estimate before inference; response usage is measured by Ollama.
        if (prompt_chars + 2) // 3 + tokens + 512 > info['context_window']:
            return {'error': 'Conversation exceeds the serving context. Start a new chat or reduce context.', 'status': 413}
        payload = {'model': MODELS[name], 'messages': messages, 'stream': False,
                   'options': {'num_predict': tokens, 'num_ctx': info['context_window'],
                               'temperature': number(body.get('temperature'), .25, 0, 2),
                               'top_p': number(body.get('top_p'), .95, 0, 1)}}
        if info['thinking']:
            if not isinstance(body.get('thinking', True), bool):
                raise ValueError('thinking must be boolean')
            payload['think'] = body.get('thinking', True)
        tools = body.get('tools')
        if tools:
            if not info['tools']:
                return {'error': 'This model does not support agent tools', 'status': 400}
            if not isinstance(tools, list) or len(tools) > 32:
                raise ValueError('Invalid tool schemas')
            payload['tools'] = tools
        response = requests.post(f'{OLLAMA_BASE}/api/chat', json=payload, timeout=600)
        response.raise_for_status()
        data = response.json()
        answer = data.get('message', {})
        return {'model': name, 'context_window': info['context_window'],
                'choices': [{'index': 0, 'message': answer,
                             'finish_reason': 'tool_calls' if answer.get('tool_calls') else data.get('done_reason', 'stop')}],
                'usage': {'prompt_tokens': data.get('prompt_eval_count', 0),
                          'completion_tokens': data.get('eval_count', 0),
                          'total_tokens': data.get('prompt_eval_count', 0) + data.get('eval_count', 0)}}
    except (ValueError, TypeError):
        return {'error': 'Invalid request or model configuration', 'status': 400}
    except requests.RequestException:
        return {'error': 'Selected model is unavailable on the inference worker', 'status': 503}


if __name__ == '__main__':
    import runpod
    runpod.serverless.start({'handler': handler})
