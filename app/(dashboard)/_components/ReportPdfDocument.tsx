import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { Transaction } from '@/lib/generated/prisma';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #f4f4f4',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    width: 100,
  },
  headerText: {
    fontSize: 10,
    color: '#a1a1aa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#09090b',
  },
  subtitle: {
    fontSize: 12,
    color: '#71717a',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1px solid #e4e4e7',
    paddingBottom: 5,
    color: '#27272a',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
  },
  tableHeader: {
    backgroundColor: '#f4f4f5',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
  },
  insightsSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f4f4f5',
    borderRadius: 5,
  },
  insightText: {
    fontSize: 11,
    marginBottom: 5,
    color: '#3f3f46',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#a1a1aa',
  },
});

interface ReportData {
  transactions: Transaction[];
  from: Date;
  to: Date;
  totalIncome: number;
  totalExpense: number;
}

export const ReportPdfDocument = ({ data }: { data: ReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {/* You might need to host the logo or pass a base64 string */}
        {/* <Image style={styles.logo} src="/logo.png" /> */}
        <Text style={styles.headerText}>
          Relatório Financeiro - {new Date().toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.title}>Relatório de Transações</Text>
      <Text style={styles.subtitle}>
        Período de {new Date(data.from).toLocaleDateString()} a {new Date(data.to).toLocaleDateString()}
      </Text>

      {/* Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo do Período</Text>
        <Text>Total de Receitas: {data.totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        <Text>Total de Despesas: {data.totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        <Text>Balanço: {(data.totalIncome - data.totalExpense).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
      </View>

      {/* Transactions Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transações Detalhadas</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Data</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Descrição</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Tipo</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Valor</Text></View>
          </View>
          {data.transactions.map((t, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{new Date(t.date).toLocaleDateString()}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{t.description}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{t.type}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text></View>
            </View>
          ))}
        </View>
      </View>

      {/* Insights Section */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <Text style={styles.insightText}>- Insight 1: Você gastou mais em [Categoria com maior gasto] neste período.</Text>
        <Text style={styles.insightText}>- Insight 2: Sua maior receita veio de [Fonte da maior receita].</Text>
        <Text style={styles.insightText}>- Insight 3: O dia com mais transações foi [Dia com mais transações].</Text>
      </View>

      <Text style={styles.footer}>
        Gerado por Finance Manager - {new Date().getFullYear()}
      </Text>
    </Page>
  </Document>
);
