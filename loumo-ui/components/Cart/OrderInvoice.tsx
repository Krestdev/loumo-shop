"use client";
import { Order, ProductVariant, Zone } from "@/types/types";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
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
  order: Order;
  variants: ProductVariant[];
  zones: Zone[];
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
  };
};

export const OrderInvoice = ({
  order,
  variants,
  zones,
  translations,
}: Props) => {
  const zoneName =
    zones.find((z) => z.id === order.address?.id)?.name || "-";

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
            <img src={"/Images/Logo.png"} style={styles.logo} alt="logo" />
          <Text style={styles.title}>{translations.title}</Text>
          <Text>{`${translations.order} #${order.id} ${translations.of} ${format(
            order.createdAt,
            "dd/MM/yyyy - HH:mm"
          )}`}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>{translations.client} :</Text>
          <Text>
            {translations.name} : {order.user.name}
          </Text>
          <Text>
            {translations.email} : {order.user.email}
          </Text>
          {order.user.tel && (
            <Text>
              {translations.phone} : {order.user.tel}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Livraison :</Text>
          <Text>
            {translations.address} : {order.address?.street}
          </Text>
          <Text>
            {translations.zone} : {zoneName}
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
          {order.orderItems?.map((item, i) => {
            const variant = variants.find(
              (v) => v.id === item.productVariantId
            );
            return (
              <View style={styles.tableRow} key={i}>
                <Text style={[styles.cell, { flex: 2 }]}>
                  {variant?.name || translations.unknownP}
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
            <Text>{order.total} FCFA</Text>
          </View>
          <View style={styles.row}>
            <Text>{translations.deliveryFee} :</Text>
            <Text>{order.deliveryFee} FCFA</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>{translations.total} :</Text>
            <Text style={styles.bold}>
              {order.total + order.deliveryFee} FCFA
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
