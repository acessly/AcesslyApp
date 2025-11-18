import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
// import { vacancyService, candidacyService, authService } from "../../services/api";

export default function VagaDetalhes() {
  const { id, titulo, empresa } = useLocalSearchParams();
  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidatando, setCandidatando] = useState(false);

  // VERSÃO COM API (DESCOMENTAR DEPOIS):
  /*
  useEffect(() => {
    carregarVaga();
  }, []);

  async function carregarVaga() {
    setLoading(true);
    try {
      const response = await vacancyService.buscarPorId(id);
      setVaga(response);
    } catch (error) {
      console.error("Erro ao carregar vaga:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCandidatar() {
    setCandidatando(true);
    try {
      const user = await authService.getCurrentUser();
      
      await candidacyService.criar({
        candidateId: user.userId,
        vacancyId: id
      });

      Alert.alert(
        "Sucesso",
        "Candidatura enviada com sucesso!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Erro ao candidatar:", error);
      Alert.alert("Erro", "Não foi possível enviar a candidatura.");
    } finally {
      setCandidatando(false);
    }
  }
  */

  // VERSÃO FAKE (SEM API):
  const vagaFake = {
    id: id,
    title: titulo || "Desenvolvedor Front-end",
    company: { name: empresa || "Tech Solutions" },
    city: "São Paulo",
    vacancyType: "REMOTE",
    salary: "R$ 5.000 - R$ 7.000",
    description: "Estamos em busca de um desenvolvedor front-end para atuar em projetos inovadores. O profissional será responsável por desenvolver interfaces acessíveis e responsivas.",
    requirements: [
      "Experiência com React ou React Native",
      "Conhecimento em HTML, CSS e JavaScript",
      "Familiaridade com metodologias ágeis",
      "Boa comunicação",
    ],
    benefits: [
      "Vale refeição",
      "Plano de saúde",
      "Horário flexível",
      "Home office",
    ],
    accessibilityOffered: [
      "Leitor de tela compatível",
      "Horário flexível",
      "Acompanhamento personalizado",
    ],
  };

  const dadosVaga = vaga || vagaFake;

  function getTipoLabel(tipo) {
    const tipos = {
      REMOTE: "Remoto",
      HYBRID: "Híbrido",
      PRESENTIAL: "Presencial",
    };
    return tipos[tipo] || tipo;
  }

  function handleCandidatar() {
    Alert.alert(
      "Confirmar candidatura",
      `Deseja se candidatar para a vaga de ${dadosVaga.title}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Candidatar", 
          onPress: () => {
            Alert.alert(
              "Sucesso",
              "Candidatura enviada com sucesso!",
              [{ text: "OK", onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  }

  function voltar() {
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={voltar}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Vaga</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        <View style={styles.mainCard}>
          <View style={styles.empresaIcon}>
            <Ionicons name="business" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.vagaTitulo}>{dadosVaga.title}</Text>
          <Text style={styles.vagaEmpresa}>{dadosVaga.company?.name || dadosVaga.company}</Text>
          
          <View style={styles.vagaDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={18} color={Colors.textLight} />
              <Text style={styles.detailText}>{dadosVaga.city}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="briefcase-outline" size={18} color={Colors.textLight} />
              <Text style={styles.detailText}>{getTipoLabel(dadosVaga.vacancyType)}</Text>
            </View>
          </View>
          
          <Text style={styles.salario}>{dadosVaga.salary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <View style={styles.sectionCard}>
            <Text style={styles.descriptionText}>{dadosVaga.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requisitos</Text>
          <View style={styles.sectionCard}>
            {dadosVaga.requirements.map((req, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                <Text style={styles.listText}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefícios</Text>
          <View style={styles.sectionCard}>
            {dadosVaga.benefits.map((benefit, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="gift-outline" size={18} color={Colors.primary} />
                <Text style={styles.listText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acessibilidade Oferecida</Text>
          <View style={styles.sectionCard}>
            {dadosVaga.accessibilityOffered.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="accessibility" size={18} color={Colors.secondary} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.candidatarButton} 
          onPress={handleCandidatar}
          disabled={candidatando}
        >
          <Ionicons name="send" size={20} color={Colors.background} />
          <Text style={styles.candidatarText}>
            {candidatando ? "Enviando..." : "Candidatar-se"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  empresaIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  vagaTitulo: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 8,
  },
  vagaEmpresa: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 16,
  },
  vagaDetails: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  salario: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    lineHeight: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  listText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  candidatarButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  candidatarText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
});