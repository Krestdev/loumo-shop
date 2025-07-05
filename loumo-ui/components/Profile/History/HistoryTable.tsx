"use client"

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
import ViewOrder from "./ViewOrder";

interface Props {
    all: boolean,
    orders: Order[]
}


const HistoryTable = ({ orders, all }: Props) => {
    const t = useTranslations("Profile.Orders")
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState<"all" | "inProgress" | "completed">("all");
    const [items, setItems] = useState(orders)
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
            {all ? <div className="flex gap-0 md:gap-3">
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
            </div> : null}
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
                    {slicedItems ? slicedItems.map((order, i) => {
                        return (
                            <TableRow key={i} className="bg-white">
                                <TableCell className="justify-center font-medium text-center" >{order.id}</TableCell>
                                <TableCell className="justify-center font-normal text-center" >{formatDateLongFR(order.createdAt)}</TableCell>
                                <TableCell className="justify-center font-medium text-center" >{`${order.total} FCFA`}</TableCell>
                                <TableCell className="justify-center font-normal text-center" >
                                    {order.status}
                                </TableCell>
                                <TableCell className="justify-center font-normal text-center" >{order.orderItems?.length ?? 0}</TableCell>
                                <TableCell className="justify-center text-center" >
                                    <ViewOrder ord={order} addressId={order.addressId}>
                                        <div className="flex w-fit px-2 py-1 items-center justify-center gap-2 rounded-full border cursor-pointer hover:bg-primary hover:text-white">
                                            <LucideEye size={16} />
                                            {t("view")}
                                        </div>
                                    </ViewOrder>
                                </TableCell>
                            </TableRow>
                        )
                    }) :
                        <p>{t("emptyTable")}</p>
                    }
                </TableBody>
            </Table>
            {all && <Pagination totalItems={orders.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
        </div>
    )
}

export default HistoryTable
