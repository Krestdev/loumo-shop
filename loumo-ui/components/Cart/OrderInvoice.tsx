"use client";

import { Order, Product, ProductVariant, Zone } from "@/types/types";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image
} from "@react-pdf/renderer";
import { format } from "date-fns";

// STYLES PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  logo: {
    width: 117,
    height: 32,
    marginBottom: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontWeight: "bold",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    padding: 6,
    borderBottom: "1pt solid #ccc",
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "0.5pt solid #eee",
  },
  cell: {
    flex: 1,
  },
});

type Props = {
  products?: Product[]
  order?: Order;
  variants: ProductVariant[];
  zones?: Zone;
  translations: {
    title: string;
    order: string;
    of: string;
    client: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    zone: string;
    product: string;
    quantity: string;
    unitPrice: string;
    total: string;
    unknownP: string;
    subtotal: string;
    deliveryFee: string;
    conditions: string;
    status: string;
    lieu: string;
  };
};

export const OrderInvoice = ({
  order,
  products,
  variants,
  zones,
  translations,
}: Props) => {

  const zoneName = zones?.name || "-";
  const frais = zones?.price ?? 0
  const subtotal = (order?.total ?? 0) - frais

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <Image src={"/logo.png"} style={styles.logo} />
          <Text style={styles.title}>{translations.title}</Text>
          <Text>{`${translations.order} #${order?.id} ${translations.of} ${order?.createdAt ? format(
            order.createdAt,
            "dd/MM/yyyy - HH:mm"
          ) : "-"}`}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>{translations.client} :</Text>
          <Text>
            {translations.name} : {order?.user.name}
          </Text>
          <Text>
            {translations.email} : {order?.user.email}
          </Text>
          {order?.user.tel && (
            <Text>
              {translations.phone} : {order?.user.tel}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Livraison :</Text>
          <Text>
            {translations.address} : {order?.address?.street}
          </Text>
          <Text>
            {translations.lieu} : {order?.note}
          </Text>
          <Text>
            {translations.zone} : {zoneName}
          </Text>
          <Text
            style={{
              color:
                order?.payment?.status !== "COMPLETED" || order?.payment?.status === null
                  ? "red"
                  : "green",
            }}
          >
            {translations.status} :{" "}
            {order?.payment?.status !== "COMPLETED" || order?.payment?.status === null
              ? "Non Payé"
              : "Payé"}
          </Text>
        </View>

        <View style={[styles.section, { marginTop: 20 }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { flex: 2 }]}>
              {translations.product}
            </Text>
            <Text style={styles.cell}>{translations.quantity}</Text>
            <Text style={styles.cell}>{translations.unitPrice}</Text>
            <Text style={styles.cell}>{translations.total}</Text>
          </View>
          {order?.orderItems?.map((item, i) => {
            const variant = variants.find(
              (v) => v.id === item.productVariantId
            );
            const product = products?.find(p => p.variants.some(v => v.id === variant?.id))

            return (
              <View style={styles.tableRow} key={i}>
                <Text style={[styles.cell, { flex: 2 }]}>
                  {product?.name && variant?.name && variant?.quantity && variant?.unit
                    ? `${product.name} (${variant.name}${variant.quantity}${variant.unit})`
                    : translations.unknownP}
                </Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>
                  {variant?.price ?? "-"} FCFA
                </Text>
                <Text style={styles.cell}>
                  {item.total} FCFA
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.section, { marginTop: 10 }]}>
          <View style={styles.row}>
            <Text>{translations.subtotal} :</Text>
            <Text>{subtotal} FCFA</Text>
          </View>
          <View style={styles.row}>
            <Text>{translations.deliveryFee} :</Text>
            <Text>{frais} FCFA</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>{translations.total} :</Text>
            <Text style={styles.bold}>
              {(order?.total ?? 0)} FCFA
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 30, textAlign: "center", alignItems: "center", maxWidth: "100%", justifyContent: "center" }}>
          <Text style={{ fontStyle: "italic", maxWidth: "75%" }}>
            {translations.conditions}
          </Text>
        </View>

      </Page>
    </Document>
  );
};
