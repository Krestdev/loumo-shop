"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Category } from "@/types/types";

type FilterSidebarProps = {
    maxPrice: number;
    categories: Category[];
    selectedCategories: Category[]
    setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>
    onFilter: (filters: {
        price: number;
        category: Category[]; // plusieurs catégories possibles
        availableOnly: boolean;
    }) => void;
};

export default function Filter({
    maxPrice,
    categories,
    onFilter,
    selectedCategories,
    setSelectedCategories
}: FilterSidebarProps) {
    const [price, setPrice] = useState(maxPrice / 2);
    const [availableOnly, setAvailableOnly] = useState(false);
    const t = useTranslations("Catalog.Filters");

    // 🔄 filtre direct : disponibilité
    useEffect(() => {
        onFilter({
            price,
            category: selectedCategories,
            availableOnly,
        });
    }, [availableOnly]);

    // 🔄 filtre direct : catégorie
    useEffect(() => {
        onFilter({
            price,
            category: selectedCategories,
            availableOnly,
        });
    }, [selectedCategories]);

    // ✅ filtre au clic pour le prix
    const handleSubmit = () => {
        onFilter({
            price,
            category: selectedCategories,
            availableOnly,
        });
    };

    const toggleCategory = (cat: Category) => {
        setSelectedCategories((prev) =>
            prev.includes(cat)
                ? prev.filter((c) => c !== cat)
                : [...prev, cat]
        );
    };

    return (
        <aside className="max-w-[240px] w-full border border-input">
            <div className="flex gap-2 px-5 py-2">
                <p className="text-lg font-semibold">{t("filters")}</p>
            </div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                {/* Filtre par prix */}
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-black flex gap-2 px-5 py-2">
                        {t("priceRange")}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-[6px] px-5 py-2">
                        <p className="mb-1 text-sm text-gray-600">
                            0 - {price.toLocaleString()} FCFA
                        </p>
                        <div className="flex items-center justify-between">
                            <Input
                                type="range"
                                min={0}
                                max={maxPrice}
                                step={500}
                                value={price}
                                onChange={(e) =>
                                    setPrice(Number(e.target.value))
                                }
                                className="px-0 w-[124px] h-[8px] bg-[#C8102E]"
                            />
                            <Button
                                onClick={handleSubmit}
                                variant={"outline"}
                                className="rounded-sm"
                            >
                                {t("find")}
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Filtre par catégorie */}
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-black flex gap-2 px-5 py-2">
                        {t("category")}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-[6px] px-5 py-2">
                        {categories.map((cat, i) => (
                            <label
                                key={i}
                                className="flex items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                                {cat.name}
                            </label>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Filtre par disponibilité */}
            <div className="flex gap-2 px-5 py-2 items-center text-sm border-t">
                <input
                    id="availableOnly"
                    type="checkbox"
                    checked={availableOnly}
                    onChange={() => setAvailableOnly((prev) => !prev)}
                />
                <label htmlFor="availableOnly">{t("show")}</label>
            </div>
        </aside>
    );
}
