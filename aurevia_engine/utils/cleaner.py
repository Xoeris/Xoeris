from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

def strip_tracking_params(url: str) -> str:
    """Strips common tracking parameters from a URL."""
    try:
        parsed = urlparse(url)
        qs = parse_qs(parsed.query, keep_blank_values=True)
        
        tracking_keys = {
            "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
            "fbclid", "gclid", "msclkid", "_ga", "ref"
        }
        
        filtered_qs = {k: v for k, v in qs.items() if k not in tracking_keys}
        new_query = urlencode(filtered_qs, doseq=True)
        
        return urlunparse(
            (parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment)
        )
    except Exception:
        return url

def format_display_url(url: str) -> str:
    """Formats a URL for clean UI display (strips protocol and www)."""
    try:
        parsed = urlparse(url)
        host = parsed.netloc
        if host.startswith("www."):
            host = host[4:]
        path = parsed.path
        if path == "/":
            path = ""
        return f"{host}{path}"
    except Exception:
        return url
