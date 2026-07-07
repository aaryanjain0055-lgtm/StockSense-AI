import json
import sys
import urllib.error
import urllib.request


BASE_URL = "http://127.0.0.1:8000"


TESTS = [
    ("Health", "/api/v1/health"),
    ("Market Quote", "/market/quote/RELIANCE.NS"),
    (
        "Historical Data",
        "/historical/RELIANCE.NS?period=1mo",
    ),
    (
        "Technical Analysis",
        "/technical/RELIANCE.NS",
    ),
    (
        "Financial Analysis",
        "/financial/RELIANCE.NS",
    ),
    (
        "Company Data",
        "/company/RELIANCE.NS",
    ),
    (
        "News",
        "/news/RELIANCE.NS",
    ),
    (
        "Sentiment",
        "/sentiment/RELIANCE.NS",
    ),
    (
        "Analysis Score",
        "/analysis/score/RELIANCE.NS",
    ),
    (
        "Production Prediction",
        "/api/v1/prediction/RELIANCE.NS",
    ),
]


def test_endpoint(
    name: str,
    path: str,
) -> bool:
    url = f"{BASE_URL}{path}"

    print(
        f"[TEST] {name} ...",
        end=" ",
        flush=True,
    )

    try:
        request = urllib.request.Request(
            url=url,
            method="GET",
            headers={
                "Accept": "application/json",
                "User-Agent": "StockSense-Smoke-Test/1.0",
            },
        )

        with urllib.request.urlopen(
            request,
            timeout=30,
        ) as response:
            status = response.status
            body = response.read().decode("utf-8")

            if body:
                json.loads(body)

            if 200 <= status < 300:
                print(
                    f"PASS (HTTP {status})",
                    flush=True,
                )
                return True

            print(
                f"FAIL (HTTP {status})",
                flush=True,
            )
            return False

    except urllib.error.HTTPError as exc:
        print(
            f"FAIL (HTTP {exc.code})",
            flush=True,
        )

        try:
            error_body = (
                exc.read()
                .decode("utf-8")
            )

            print(
                f"       {error_body[:300]}",
                flush=True,
            )
        except Exception:
            pass

        return False

    except Exception as exc:
        print(
            f"FAIL ({type(exc).__name__}: {exc})",
            flush=True,
        )
        return False


def main() -> None:
    print()
    print("=" * 60)
    print("STOCKSENSE AI - BACKEND SMOKE TEST")
    print("=" * 60)
    print()

    passed = 0
    failed = 0

    for name, path in TESTS:
        success = test_endpoint(
            name=name,
            path=path,
        )

        if success:
            passed += 1
        else:
            failed += 1

    print()
    print("=" * 60)
    print("RESULT")
    print("=" * 60)
    print(f"PASSED : {passed}")
    print(f"FAILED : {failed}")
    print(f"TOTAL  : {len(TESTS)}")

    if failed == 0:
        print(
            "STATUS : BACKEND INTEGRATION HEALTHY"
        )
        sys.exit(0)

    print(
        "STATUS : BACKEND INTEGRATION HAS FAILURES"
    )
    sys.exit(1)


if __name__ == "__main__":
    main()