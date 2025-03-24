#!/usr/bin/env python3
import os
import re
import json
import argparse

def scan_file(file_path):
    """
    Scans a single file for Camel processor definitions and route information.
    Returns a dictionary with:
      - "processors": list of found processor class names.
      - "routes": a dictionary with keys "apis", "endpoints_from", "endpoints_to", and "transformations".
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        # If file reading fails, skip this file.
        return None

    # Initialize results
    processors = []
    routes = {"apis": [], "endpoints_from": [], "endpoints_to": [], "transformations": []}

    # Look for Camel processor classes (e.g., public class MyProcessor implements Processor)
    proc_match = re.search(r'public\s+class\s+(\w+)\s+implements\s+Processor', content)
    if proc_match:
        processors.append(proc_match.group(1))
    
    # Check if this file appears to contain Camel route definitions
    # (e.g., extends RouteBuilder or contains DSL calls like from( or rest()
    if "extends RouteBuilder" in content or "from(" in content or "rest(" in content:
        # Find endpoints defined with from("...") and to("...")
        routes["endpoints_from"] = re.findall(r'from\("([^"]+)"\)', content)
        routes["endpoints_to"]   = re.findall(r'to\("([^"]+)"\)', content)
        # Look for API definitions using Camel's REST DSL
        routes["apis"] = re.findall(r'rest\("([^"]+)"\)', content)
        # Look for transformation steps (calls to transform())
        routes["transformations"] = re.findall(r'\.transform\(([^)]+)\)', content)

    return {"processors": processors, "routes": routes}

def scan_repository(repo_path):
    """
    Walks the given repository path and scans files that are likely to contain Camel code.
    Returns a catalog dictionary with two keys:
      - "processors": list of { "class_name": ..., "file": ... }
      - "routes": list of { "file": ..., "apis": [...], "endpoints_from": [...], "endpoints_to": [...], "transformations": [...] }
    """
    catalog = {"processors": [], "routes": []}
    for root, dirs, files in os.walk(repo_path):
        for file in files:
            # Process files with these common extensions
            if file.endswith(('.java', '.xml', '.groovy')):
                full_path = os.path.join(root, file)
                result = scan_file(full_path)
                if result is None:
                    continue
                # If any processor is found, add it to the catalog.
                for proc in result["processors"]:
                    catalog["processors"].append({
                        "class_name": proc,
                        "file": full_path
                    })
                # If the routes dictionary has any non-empty lists, add the route information.
                if any(result["routes"].values()):
                    route_entry = result["routes"]
                    route_entry["file"] = full_path
                    catalog["routes"].append(route_entry)
    return catalog

def main():
    parser = argparse.ArgumentParser(
        description="Scan a repository for Camel processors and route definitions (APIs and transformations) and output a JSON catalog."
    )
    # Use current working directory as default if repo_path is not provided
    parser.add_argument("repo_path", nargs="?", default=os.getcwd(), help="Local path to the repository to scan. Defaults to the current working directory.")
    # Use 'output.json' as the default output filename if not provided
    parser.add_argument("output_json", nargs="?", default="output.json", help="Output JSON file name. Defaults to 'output.json'.")
    args = parser.parse_args()

    catalog = scan_repository(args.repo_path)
    try:
        with open(args.output_json, "w", encoding="utf-8") as f:
            json.dump(catalog, f, indent=4)
        print(f"Catalog successfully written to {args.output_json}")
    except Exception as e:
        print(f"Error writing to output file: {e}")

if __name__ == '__main__':
    main()
