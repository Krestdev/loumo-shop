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
import { Category, Product, ProductVariant } from "@/types/types";

interface FilterProps {
    categories: Category[];
    selectedCategories: Category[];
    setSelectedCategories: (categories: Category[]) => void;
    price: number;
    setPrice: (price: number) => void;
    availableOnly: boolean;
    setAvailableOnly: (value: boolean) => void;
    maxPrice: number;
}

export default function Filter({
    price,
    setPrice,
    availableOnly,
    setAvailableOnly,
    maxPrice,
    categories,
    selectedCategories,
    setSelectedCategories
}: FilterProps) {
    const t = useTranslations("Catalog.Filters");

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(Number(e.target.value));
    };

    const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAvailableOnly(e.target.checked);
    };

    const handleCategoryChange = (category: Category) => {
        const isSelected = selectedCategories.some((cat) => cat.id === category.id);
        if (isSelected) {
            setSelectedCategories(selectedCategories.filter((cat) => cat.id !== category.id));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
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
                                onChange={(e) => {
                                    setPrice(Number(e.target.value))
                                    handlePriceChange
                                }
                                }
                                className="px-0 w-[124px] h-[8px] bg-[#C8102E]"
                            />
                            <Button
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
                        {categories
                            .filter(category =>
                                category.products?.some(product => product.variants && product.variants.length > 0)
                            )
                            .map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.some((cat) => cat.id === category.id)}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    {category.name}
                                </label>
                            ))}

                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Filtre par disponibilité */}
            <div className="flex gap-2 px-5 py-2 items-center text-sm border-t">
                <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={handleAvailabilityChange}
                />
                <label htmlFor="availableOnly">{t("show")}</label>
            </div>
        </aside>
    );
}