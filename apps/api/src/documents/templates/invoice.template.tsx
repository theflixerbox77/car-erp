import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 700 },
  business: { fontSize: 12, fontWeight: 700, marginBottom: 2 },
  muted: { color: '#666666' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 10, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', color: '#666666' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  table: { marginTop: 8, borderTop: '1px solid #dddddd' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottom: '1px solid #eeeeee' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 4, borderTop: '2px solid #333333' },
  totalLabel: { fontSize: 12, fontWeight: 700 },
});

export interface InvoiceData {
  documentTitle: string;
  invoiceNumber: string;
  issuedAt: string;
  dealer: { businessName: string; address?: string | null; phone?: string | null; email?: string | null };
  customer: { fullName: string; phone?: string | null; email?: string | null; address?: string | null };
  vehicle: { brand: string; model: string; year: number; stockNumber: string; vin?: string | null };
  salePrice: string;
  discount: string;
  amountDue: string;
  amountPaid: string;
}

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  const netTotal = Number(data.salePrice) - Number(data.discount);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.business}>{data.dealer.businessName}</Text>
            {data.dealer.address && <Text style={styles.muted}>{data.dealer.address}</Text>}
            {data.dealer.phone && <Text style={styles.muted}>{data.dealer.phone}</Text>}
            {data.dealer.email && <Text style={styles.muted}>{data.dealer.email}</Text>}
          </View>
          <View>
            <Text style={styles.title}>{data.documentTitle}</Text>
            <Text style={styles.muted}>No. {data.invoiceNumber}</Text>
            <Text style={styles.muted}>{data.issuedAt}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text>{data.customer.fullName}</Text>
          {data.customer.phone && <Text style={styles.muted}>{data.customer.phone}</Text>}
          {data.customer.email && <Text style={styles.muted}>{data.customer.email}</Text>}
          {data.customer.address && <Text style={styles.muted}>{data.customer.address}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text>
                {data.vehicle.brand} {data.vehicle.model} ({data.vehicle.year}) — Stock #{data.vehicle.stockNumber}
                {data.vehicle.vin ? ` — VIN ${data.vehicle.vin}` : ''}
              </Text>
              <Text>{Number(data.salePrice).toLocaleString()}</Text>
            </View>
            {Number(data.discount) > 0 && (
              <View style={styles.tableRow}>
                <Text>Discount</Text>
                <Text>-{Number(data.discount).toLocaleString()}</Text>
              </View>
            )}
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalLabel}>{netTotal.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.muted}>Amount Paid</Text>
            <Text>{Number(data.amountPaid).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.muted}>Amount Due</Text>
            <Text>{Number(data.amountDue).toLocaleString()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
