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
import { Success } from "@/components/Cart/Dialog/Success";
import CancelOrder from "@/components/Cart/Dialog/CancelOrder";

interface Props {
    all: boolean;
    orders: Order[];
}

const HistoryTable = ({ orders, all }: Props) => {
    const t = useTranslations("Profile.Orders");
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState<"all" | "inProgress" | "completed">("all");
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // 🔥 Nouveau pour gérer l'annulation
    const [cancelOrderOpen, setCancelOrderOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

    const [items, setItems] = useState(orders);
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedItems = items.slice(startIndex, startIndex + itemsPerPage);

    const onCancelOrder = async (ord: Order) => {
        try {
            const res = await fetch(`${base}orders/cancel/${ord.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Erreur lors de l'annulation");
            }
        } catch (error) {
            console.error("Erreur annulation :", error);
        }
    };

    function formatDateShortFR(dateInput?: string | number | Date): string {
        const date = dateInput ? new Date(dateInput) : new Date();
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
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

    const statusLabels: Record<string, string> = {
        FAILED: t("echoue"),
        COMPLETED: t("termine"),
        PROCESSING: t("encours"),
        REJECTED: t("rejete"),
        ACCEPTED: t("accepte"),
        PENDING: t("enattente"),
        CANCELED: t("annule"),
    };

    return (
        <div className='flex flex-col max-w-[1400px] w-full gap-2 md:gap-5'>
            <p className="text-primary/80 text-[18px] md:text-[28px] font-semibold leading-[100%]">{t("orders")}</p>

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
                        <TableHead className="text-center hidden md:block">{t("reference")}</TableHead>
                        <TableHead className="text-center md:hidden my-auto">{t("reference2")}</TableHead>
                        <TableHead className="text-center">{t("date")}</TableHead>
                        <TableHead className="text-center">{t("amount")}</TableHead>
                        <TableHead className="text-center">{t("status")}</TableHead>
                        <TableHead className="text-center">{t("items")}</TableHead>
                        <TableHead className="text-center">{t("actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {slicedItems.length > 0 ? slicedItems.reverse().map((order, i) => {
                        return (
                            <TableRow key={order.id ?? i} className="bg-white">
                                <TableCell className="text-center">{order.ref.length > 4 ? `${order.ref.slice(0, 4)}...` : order.ref}</TableCell>
                                <TableCell className="text-center">{formatDateShortFR(order.createdAt)}</TableCell>
                                <TableCell className="text-center">{`${order.total} FCFA`}</TableCell>
                                <TableCell className="text-center">{statusLabels[order.status] ?? order.status}</TableCell>
                                <TableCell className="text-center">{order.orderItems?.length ?? 0}</TableCell>
                                <TableCell className="text-center">
                                    {/* Détails */}
                                    <Button
                                        // disabled={order.status === "CANCELED"}
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setOpen(true);
                                        }} variant={"default"} className={`z-10 mr-2 ${order.status === "CANCELED" ? "opacity-50 cursor-not-allowed" : ""}`}>
                                        {t("view")}
                                    </Button>

                                    {/* Annuler */}
                                    <CancelOrder 
                                        cancelOrder={cancelOrderOpen} 
                                        setCancelOrder={setCancelOrderOpen} 
                                        action={() => { 
                                            if (orderToCancel) {
                                                onCancelOrder(orderToCancel); 
                                            }
                                            setCancelOrderOpen(false); 
                                            setOrderToCancel(null);
                                        }} 
                                        order={orderToCancel}
                                    >
                                        <Button
                                            disabled={order.status === "CANCELED" || order.status === "COMPLETED" || order.status === "FAILED" || order.status === "REJECTED"}
                                            onClick={() => {
                                                setOrderToCancel(order);
                                                setCancelOrderOpen(true);
                                            }}
                                            variant={"outline"}
                                            className={`z-10 ${order.status === "CANCELED" ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {t("annuleButton")}
                                        </Button>
                                    </CancelOrder>
                                </TableCell>
                            </TableRow>
                        )
                    }) :
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
