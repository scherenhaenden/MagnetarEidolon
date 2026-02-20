#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED_SECTIONS = [
    "Summary",
    "What's new",
    "Fixes",
    "Breaking changes",
    "Technical details",
    "Known issues / limitations",
    "Compatibility matrix",
    "Verification checklist",
]


def normalize_headings(markdown: str) -> set[str]:
    return {
        match.group(1).strip().lower()
        for match in re.finditer(r"^#{1,6}\s+(.+?)\s*$", markdown, flags=re.MULTILINE)
    }


def validate_release_notes(markdown: str, min_chars: int) -> list[str]:
    errors: list[str] = []
    headings = normalize_headings(markdown)

    for section in REQUIRED_SECTIONS:
        if section.lower() not in headings:
            errors.append(f"Missing required section heading: '{section}'")

    if len(markdown.strip()) < min_chars:
        errors.append(
            f"Release notes are too short ({len(markdown.strip())} chars); expected at least {min_chars}."
        )

    placeholder_markers = ["TBD", "TODO", "<fill", "[none]"]
    for marker in placeholder_markers:
        if marker.lower() in markdown.lower():
            errors.append(f"Release notes contain placeholder marker: '{marker}'")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate detailed release notes format.")
    parser.add_argument("--file", required=True, type=Path, help="Path to release notes markdown")
    parser.add_argument("--min-chars", type=int, default=1200)
    args = parser.parse_args()

    markdown = args.file.read_text(encoding="utf-8")
    errors = validate_release_notes(markdown, min_chars=args.min_chars)

    if errors:
        print("Release notes validation failed:")
        for err in errors:
            print(f"- {err}")
        return 1

    print("Release notes validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
