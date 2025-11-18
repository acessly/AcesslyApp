import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
// import { vacancyService } from "../../services/api";

export default function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(false);

  // VERSÃO COM API (DESCOMENTAR DEPOIS):
  /*
  useEffect(() => {
    carregarVagas();
  }, []);

  async function carregarVagas() {
    setLoading(true);
    try {
      const response = await vacancyService.listar(0, 20);
      setVagas(response.content);
    } catch (error) {
      console.error("Erro ao carregar vagas:", error);
    } finally {
      setLoading(false);
    }
  }
  */

  // VERSÃO FAKE (SEM API - USAR AGORA):
  const vagasFake = [
    {
      id: 1,
      title: "Desenvolvedor Front-end",
      company: { name: "Tech Solutions" },
      city: "São Paulo",
      vacancyType: "REMOTE",
      salary: "R$ 5.000 - R$ 7.000",
      accessibilityOffered: ["Leitor de tela", "Horário flexível"],
    },
    {
      id: 2,
      title: "Analista de RH",
      company: { name: "Inclusiva Corp" },
      city: "Rio de Janeiro",
      vacancyType: "HYBRID",
      salary: "R$ 4.000 - R$ 5.500",
      accessibilityOffered: ["Rampa", "Elevador", "Intérprete de Libras"],
    },
    {
      id: 3,
      title: "Designer UX/UI",
      company: { name: "Creative Agency" },
      city: "Belo Horizonte",
      vacancyType: "PRESENTIAL",
      salary: "R$ 4.500 - R$ 6.000",
      accessibilityOffered: ["Estacionamento PCD", "Banheiro adaptado"],
    },
    {
      id: 4,
      title: "Atendente de Suporte",
      company: { name: "HelpDesk Plus" },
      city: "Curitiba",
      vacancyType: "REMOTE",
      salary: "R$ 2.500 - R$ 3.500",
      accessibilityOffered: ["Software adaptado", "Horário flexível"],
    },
  ];

  const listaVagas = vagas.length > 0 ? vagas : vagasFake;

  function getTipoLabel(tipo) {
    const tipos = {
      REMOTE: "Remoto",
      HYBRID: "Híbrido",
      PRESENTIAL: "Presencial",
    };
    return tipos[tipo] || tipo;
  }

  function abrirVaga(vaga) {
    router.push({
      pathname: "/vaga/[id]",
      params: { 
        id: vaga.id, 
        titulo: vaga.title, 
        empresa: vaga.company?.name || vaga.company 
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vagas Disponíveis</Text>
        <Text style={styles.headerSubtitle}>{listaVagas.length} oportunidades encontradas</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={Colors.primary} />
          <Text style={styles.filterText}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="location" size={20} color={Colors.primary} />
          <Text style={styles.filterText}>Localização</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {listaVagas.map((vaga) => (
          <TouchableOpacity 
            key={vaga.id} 
            style={styles.vagaCard}
            onPress={() => abrirVaga(vaga)}
          >
            <View style={styles.vagaHeader}>
              <View style={styles.empresaIcon}>
                <Ionicons name="business" size={24} color={Colors.primary} />
              </View>
              <View style={styles.vagaInfo}>
                <Text style={styles.vagaTitulo}>{vaga.title}</Text>
                <Text style={styles.vagaEmpresa}>{vaga.company?.name || vaga.company}</Text>
              </View>
            </View>

            <View style={styles.vagaDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={16} color={Colors.textLight} />
                <Text style={styles.detailText}>{vaga.city}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="briefcase-outline" size={16} color={Colors.textLight} />
                <Text style={styles.detailText}>{getTipoLabel(vaga.vacancyType)}</Text>
              </View>
            </View>

            <Text style={styles.vagaSalario}>{vaga.salary}</Text>

            <View style={styles.acessibilidadeContainer}>
              {vaga.accessibilityOffered?.slice(0, 2).map((item, index) => (
                <View key={index} style={styles.acessibilidadeTag}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  <Text style={styles.acessibilidadeText}>{item}</Text>
                </View>
              ))}
              {vaga.accessibilityOffered?.length > 2 && (
                <View style={styles.acessibilidadeTag}>
                  <Text style={styles.acessibilidadeText}>+{vaga.accessibilityOffered.length - 2}</Text>
                </View>
              )}
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  filterText: {
    fontFamily: Fonts.regular,
    color: Colors.white,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  vagaCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vagaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  empresaIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  vagaInfo: {
    flex: 1,
  },
  vagaTitulo: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  vagaEmpresa: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  vagaDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  vagaSalario: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  acessibilidadeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  acessibilidadeTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  acessibilidadeText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
});