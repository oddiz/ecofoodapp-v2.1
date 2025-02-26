import json

with open("./src/data/all_items_data_sample.json", "r") as f:
		data = json.load(f)

unique_groups = set()
unique_tags = set()
unique_calories = set()

all_items = data.get("AllItems", {})

for item_key, item_info in all_items.items():
    # 1) Grab the group if it exists
    group_info = item_info.get("PropertyInfos", {}).get("Group", {}).get("String")
    if group_info:
        unique_groups.add(group_info)

    # 2) Grab all tags
    tags_list = item_info.get("Tags", [])
    for tag in tags_list:
        unique_tags.add(tag)
    
    # 3) Attempt to get calorie info.
    #    There's no 'calories' field in the snippet, so handle it conditionally:
    calories_info = item_info.get("PropertyInfos", {}).get("Calories")
    if isinstance(calories_info, dict):
        # Adjust this if your actual JSON data has a different structure for Calories
        calorie_value = calories_info.get("Single")
        if calorie_value:
            unique_calories.add(calorie_value)

print("Unique Groups:", unique_groups)
print("Unique Tags:", unique_tags)
print("Unique Calories:", unique_calories)
