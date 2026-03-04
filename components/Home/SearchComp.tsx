"use client";

import { useQuery } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import ProductQuery from "@/queries/product";
import { useTranslations } from "next-intl";

function SearchComp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const t = useTranslations("Header");

  const handleClick = (e: Event) => {
    if (!formRef.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAll(),
  });

  const Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setSearch("");
    router.push(
      "/search?" + createQueryString("nom", encodeURIComponent(search))
    );
  };

  // Utiliser useMemo pour filtrer les produits en fonction de la recherche
  const filteredProducts = useMemo(() => {
    if (search.length === 0 || !productData.data) return [];
    return productData.data.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, productData.data]);

  // Gérer l'ouverture/fermeture du dropdown en fonction de la recherche
  const shouldShowDropdown = search.length > 0 && filteredProducts.length > 0;

  // Gérer le changement de recherche
  const handleSearchChange = (value: string) => {
    setSearch(value);

    // Ouvrir seulement si on a une recherche non vide
    if (value.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the list
    document.addEventListener("mousedown", handleClick);
    // Remove event listener on cleanup
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <form className="relative hidden lg:block" onSubmit={Submit} ref={formRef}>
      <Input
        type="search"
        placeholder={t("search")}
        className="w-[300px] flex-shrink-0"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      {open && shouldShowDropdown && (
        <div className="absolute bottom-0 translate-y-[100%]  bg-white z-20 w-full max-h-72 overflow-y-auto">
          <div
            className="flex flex-col gap-0 divide-y"
            onClick={() => {
              setOpen(false);
              setSearch("");
            }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <Link
                  key={index}
                  href={`/catalog/${product.slug}`}
                  className="px-5 h-9 flex items-center hover:bg-slate-100"
                >
                  {product.name.toLowerCase()}
                </Link>
              ))
            ) : (
              <span className="w-full italic text-slate-700 py-2 px-4 bg-white">
                {t("NoResult")}
              </span>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default SearchComp;
