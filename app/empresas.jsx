import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../constants/Colors";

export default function Empresas() {
  // VERSÃO FAKE (SEM API - USAR AGORA):
  const empresasFake = [
    {
      id: 1,
      name: "Tech Solutions",
      sector: "Tecnologia",
      city: "São Paulo",
      openVacancies: 3,
      description: "Empresa líder em soluções tecnológicas com foco em acessibilidade digital.",
      accessibilityFeatures: ["Leitor de tela", "Horário flexível", "Home office"],
    },
    {
      id: 2,
      name: "Inclusiva Corp",
      sector: "Recursos Humanos",
      city: "Rio de Janeiro",
      openVacancies: 2,
      description: "Consultoria especializada em inclusão e diversidade no ambiente corporativo.",
      accessibilityFeatures: ["Rampa", "Elevador", "Intérprete de Libras", "Banheiro adaptado"],
    },
    {
      id: 3,
      name: "Creative Agency",
      sector: "Design e Marketing",
      city: "Belo Horizonte",
      openVacancies: 1,
      description: "Agência criativa que valoriza a diversidade em suas equipes.",
      accessibilityFeatures: ["Estacionamento PCD", "Banheiro adaptado", "Mobiliário ergonômico"],
    },
    {
      id: 4,
      name: "HelpDesk Plus",
      sector: "Atendimento ao Cliente",
      city: "Curitiba",
      openVacancies: 4,
      description: "Empresa de suporte técnico com ambiente 100% inclusivo.",
      accessibilityFeatures: ["Software adaptado", "Horário flexível", "Trabalho remoto"],
    },
    {
      id: 5,
      name: "DataFlow Analytics",
      sector: "Análise de Dados",
      city: "Porto Alegre",
      openVacancies: 2,
      description: "Startup de análise de dados comprometida com a inclusão.",
      accessibilityFeatures: ["Home office", "Equipamentos adaptados", "Mentoria especializada"],
    },
  ];

  function voltar() {
    router.back();
  }

  function verVagasEmpresa(empresaNome) {
    router.push({
      pathname: "/(tabs)/vagas",
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={voltar}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Empresas Parceiras</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>
          {empresasFake.length} empresas comprometidas com a inclusão
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {empresasFake.map((empresa) => (
          <View key={empresa.id} style={styles.empresaCard}>
            <View style={styles.cardHeader}>
              <View style={styles.empresaIcon}>
                <Ionicons name="business" size={28} color={Colors.primary} />
              </View>
              <View style={styles.empresaInfo}>
                <Text style={styles.empresaNome}>{empresa.name}</Text>
                <Text style={styles.empresaSetor}>{empresa.sector}</Text>
              </View>
              <View style={styles.vagasBadge}>
                <Text style={styles.vagasNumero}>{empresa.openVacancies}</Text>
                <Text style={styles.vagasLabel}>vagas</Text>
              </View>
            </View>

            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={Colors.textLight} />
              <Text style={styles.locationText}>{empresa.city}</Text>
            </View>

            <Text style={styles.descriptionText}>{empresa.description}</Text>

            <View style={styles.accessibilitySection}>
              <Text style={styles.accessibilityTitle}>Acessibilidade oferecida:</Text>
              <View style={styles.accessibilityContainer}>
                {empresa.accessibilityFeatures.slice(0, 3).map((feature, index) => (
                  <View key={index} style={styles.accessibilityTag}>
                    <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                    <Text style={styles.accessibilityText}>{feature}</Text>
                  </View>
                ))}
                {empresa.accessibilityFeatures.length > 3 && (
                  <View style={styles.accessibilityTag}>
                    <Text style={styles.accessibilityText}>
                      +{empresa.accessibilityFeatures.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.verVagasButton}
              onPress={() => verVagasEmpresa(empresa.name)}
            >
              <Text style={styles.verVagasText}>Ver vagas disponíveis</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.bottomSpacing} />
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
  subHeader: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  empresaCard: {
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
    marginBottom: 12,
  },
  empresaIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  empresaInfo: {
    flex: 1,
  },
  empresaNome: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  empresaSetor: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  vagasBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  vagasNumero: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  vagasLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.primary,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    lineHeight: 20,
    marginBottom: 16,
  },
  accessibilitySection: {
    marginBottom: 16,
  },
  accessibilityTitle: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
    marginBottom: 8,
  },
  accessibilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  accessibilityTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  accessibilityText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  verVagasButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  verVagasText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  bottomSpacing: {
    height: 24,
  },
});