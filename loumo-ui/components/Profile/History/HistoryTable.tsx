"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Order } from "@/types/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Pagination from "./Pagination";
import { Button } from "@/components/ui/button";
import { LucideEye } from "lucide-react";
import { Success } from "@/components/Cart/Dialog/Success";

interface Props {
    all: boolean;
    orders: Order[];
}

const HistoryTable = ({ orders, all }: Props) => {
    const t = useTranslations("Profile.Orders");
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState<"all" | "inProgress" | "completed">("all");
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [items, setItems] = useState(orders);
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedItems = items.slice(startIndex, startIndex + itemsPerPage);

    function formatDateLongFR(dateInput?: string | number | Date): string {
        const date = dateInput ? new Date(dateInput) : new Date();
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    const handleClick = (stat: "all" | "inProgress" | "completed") => {
        setStatus(stat);
        switch (stat) {
            case "all":
                setItems(orders);
                break;
            case "inProgress":
                setItems(orders.filter(x => x.status === "PENDING"));
                break;
            case "completed":
                setItems(orders.filter(x => x.status === "COMPLETED"));
                break;
        }
    };

    return (
        <div className='flex flex-col max-w-[1400px] w-full px-7 py-8 gap-10'>
            <p className="text-primary/80 text-[36px] font-semibold">{t("orders")}</p>

            {all &&
                <div className="flex gap-0 md:gap-3">
                    <Button onClick={() => handleClick("all")} variant={status === "all" ? "default" : "ghost"}>
                        {t("all")}
                        <div className={`h-[29px] px-2 rounded-[20px] text-black p-1 ${status === "all" ? "bg-white" : "bg-primary/20"}`}>{orders.length}</div>
                    </Button>
                    <Button onClick={() => handleClick("inProgress")} variant={status === "inProgress" ? "default" : "ghost"}>
                        {t("inProgress")}
                        <div className={`h-[29px] px-2 rounded-[20px] text-black p-1 ${status === "inProgress" ? "bg-white" : "bg-primary/20"}`}>{orders.filter(x => x.status === "PENDING").length}</div>
                    </Button>
                    <Button onClick={() => handleClick("completed")} variant={status === "completed" ? "default" : "ghost"}>
                        {t("completed")}
                        <div className={`h-[29px] px-2 rounded-[20px] text-black p-1 ${status === "completed" ? "bg-white" : "bg-primary/20"}`}>{orders.filter(x => x.status === "COMPLETED").length}</div>
                    </Button>
                </div>
            }

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">{t("reference")}</TableHead>
                        <TableHead className="text-center">{t("date")}</TableHead>
                        <TableHead className="text-center">{t("amount")}</TableHead>
                        <TableHead className="text-center">{t("status")}</TableHead>
                        <TableHead className="text-center">{t("items")}</TableHead>
                        <TableHead className="text-center">{t("actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {slicedItems.length > 0 ? slicedItems.map((order, i) => (
                        <TableRow key={order.id ?? i} className="bg-white">
                            <TableCell className="text-center">{order.id}</TableCell>
                            <TableCell className="text-center">{formatDateLongFR(order.createdAt)}</TableCell>
                            <TableCell className="text-center">{`${order.total} FCFA`}</TableCell>
                            <TableCell className="text-center">{order.status}</TableCell>
                            <TableCell className="text-center">{order.orderItems?.length ?? 0}</TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant={"outline"}
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setOpen(true);
                                    }}
                                >
                                    <LucideEye size={16} />
                                    {t("view")}
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) :
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                {t("emptyTable")}
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>

            {all && (
                <Pagination
                    totalItems={orders.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}

            {/* 🔥 Success Dialog Global */}
            {selectedOrder && (
                <Success open={open} setOpen={setOpen} order={selectedOrder} />
            )}
        </div>
    );
};

export default HistoryTable;
