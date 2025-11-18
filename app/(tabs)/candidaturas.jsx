import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
// import { candidacyService, authService } from "../../services/api";

export default function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(false);

  // VERSÃO COM API (DESCOMENTAR DEPOIS):
  /*
  useEffect(() => {
    carregarCandidaturas();
  }, []);

  async function carregarCandidaturas() {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (user.candidateId) {
        const response = await candidacyService.listarPorCandidato(user.candidateId, 0, 20);
        setCandidaturas(response.content || []);
      }
    } catch (error) {
      console.error("Erro ao carregar candidaturas:", error);
    } finally {
      setLoading(false);
    }
  }
  */

  // VERSÃO FAKE (SEM API - USAR AGORA):
  const candidaturasFake = [
    {
      id: 1,
      vacancy: {
        id: 1,
        title: "Desenvolvedor Front-end",
        company: { name: "Tech Solutions" },
        city: "São Paulo",
        vacancyType: "REMOTE",
      },
      status: "APPROVED",
      appliedAt: "2024-01-15",
    },
    {
      id: 2,
      vacancy: {
        id: 2,
        title: "Analista de RH",
        company: { name: "Inclusiva Corp" },
        city: "Rio de Janeiro",
        vacancyType: "HYBRID",
      },
      status: "UNDER_ANALYSIS",
      appliedAt: "2024-01-10",
    },
    {
      id: 3,
      vacancy: {
        id: 3,
        title: "Designer UX/UI",
        company: { name: "Creative Agency" },
        city: "Belo Horizonte",
        vacancyType: "PRESENTIAL",
      },
      status: "REJECTED",
      appliedAt: "2024-01-05",
    },
  ];

  const listaCandidaturas = candidaturas.length > 0 ? candidaturas : candidaturasFake;

  function getStatusLabel(status) {
    const labels = {
      UNDER_ANALYSIS: "Em análise",
      APPROVED: "Aprovado",
      REJECTED: "Rejeitado",
    };
    return labels[status] || status;
  }

  function getStatusColor(status) {
    const colors = {
      UNDER_ANALYSIS: Colors.accent,
      APPROVED: Colors.success,
      REJECTED: Colors.error,
    };
    return colors[status] || Colors.textLight;
  }

  function getStatusIcon(status) {
    const icons = {
      UNDER_ANALYSIS: "time-outline",
      APPROVED: "checkmark-circle-outline",
      REJECTED: "close-circle-outline",
    };
    return icons[status] || "help-outline";
  }

  function getTipoLabel(tipo) {
    const tipos = {
      REMOTE: "Remoto",
      HYBRID: "Híbrido",
      PRESENTIAL: "Presencial",
    };
    return tipos[tipo] || tipo;
  }

  function abrirVaga(vagaId) {
    router.push({
      pathname: "/vaga/[id]",
      params: { id: vagaId },
    });
  }

    if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando candidaturas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Candidaturas</Text>
        <Text style={styles.headerSubtitle}>{candidaturas.length} candidatura(s)</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {candidaturas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Nenhuma candidatura</Text>
            <Text style={styles.emptyText}>
              Você ainda não se candidatou a nenhuma vaga. Explore as oportunidades disponíveis!
            </Text>
            <TouchableOpacity 
              style={styles.explorarButton}
              onPress={() => router.push("/(tabs)/vagas")}
            >
              <Text style={styles.explorarText}>Explorar vagas</Text>
            </TouchableOpacity>
          </View>
        ) : (
          candidaturas.map((candidatura) => (
            <TouchableOpacity 
              key={candidatura.id} 
              style={styles.candidaturaCard}
              onPress={() => abrirVaga(candidatura.vacancyId)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.empresaIcon}>
                  <Ionicons name="business" size={24} color={Colors.primary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.vagaTitulo}>{candidatura.vacancyTitle}</Text>
                  <Text style={styles.vagaEmpresa}>{candidatura.companyName}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(candidatura.status) + '20' }]}>
                  <Ionicons 
                    name={getStatusIcon(candidatura.status)} 
                    size={16} 
                    color={getStatusColor(candidatura.status)} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(candidatura.status) }]}>
                    {getStatusLabel(candidatura.status)}
                  </Text>
                </View>
                <Text style={styles.dataText}>
                  Enviada em {new Date(candidatura.applicationDate).toLocaleDateString('pt-BR')}
                </Text>
              </View>

            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  explorarButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  explorarText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  candidaturaCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
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
  cardInfo: {
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
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  dataText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
});