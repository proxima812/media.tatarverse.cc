import {
	CATEGORY_DEFINITIONS,
	type Category,
} from "@/components/Catalog/taxonomy";

export function categoryIcon(category: Category): string {
	return CATEGORY_DEFINITIONS[category].icon;
}
