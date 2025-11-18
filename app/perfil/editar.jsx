import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
import { candidateService, userService, authService } from "../../services/api";

export default function EditarPerfil() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoDeficiencia, setTipoDeficiencia] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [acessibilidadeNecessaria, setAcessibilidadeNecessaria] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userId, setUserId] = useState(null);
  const [candidateId, setCandidateId] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoadingData(true);
    try {
      const user = await authService.getCurrentUser();
      setUserId(user.userId);
      setCandidateId(user.candidateId);

      
      if (user.userId) {
        const userData = await userService.buscarPorId(user.userId);
        setNome(userData.name || "");
        setEmail(userData.email || "");
        setTelefone(userData.phone || "");
        setCidade(userData.city || "");
        setEstado(userData.state || "");
      }

      
      if (user.candidateId) {
        const candidateData = await candidateService.buscarPorId(user.candidateId);
        setTipoDeficiencia(candidateData.disabilityType || "");
        setHabilidades(candidateData.skills || "");
        setAcessibilidadeNecessaria(candidateData.requiredAcessibility || "");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSalvar() {
    if (!nome || !email || !telefone || !cidade) {
      Alert.alert("Atenção", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      
      if (userId) {
        await userService.atualizar(userId, {
          name: nome,
          email: email,
          phone: telefone,
          city: cidade,
          state: estado,
        });
      }

      
      if (candidateId) {
        await candidateService.atualizar(candidateId, {
          userId: parseInt(userId),
          disabilityType: tipoDeficiencia,
          skills: habilidades,
          requiredAcessibility: acessibilidadeNecessaria,
        });
      }

      Alert.alert(
        "Sucesso",
        "Perfil atualizado com sucesso!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletarConta() {
    Alert.alert(
      "Deletar conta",
      "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Deletar", 
          style: "destructive",
          onPress: async () => {
            try {
              
              if (candidateId) {
                await candidateService.deletar(candidateId);
              }
              
              if (userId) {
                await userService.deletar(userId);
              }
              await authService.logout();
              router.replace("/");
            } catch (error) {
              console.error("Erro ao deletar conta:", error);
              Alert.alert("Erro", "Não foi possível deletar a conta.");
            }
          }
        }
      ]
    );
  }

  function voltar() {
    router.back();
  }

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={voltar}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome completo *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor={Colors.textLight}
                value={nome}
                onChangeText={setNome}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-mail *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Telefone *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor={Colors.textLight}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cidade *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Sua cidade"
                placeholderTextColor={Colors.textLight}
                value={cidade}
                onChangeText={setCidade}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Estado</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="map-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Ex: SP"
                placeholderTextColor={Colors.textLight}
                value={estado}
                onChangeText={setEstado}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Candidato</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de Deficiência</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="accessibility-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Física, visual, auditiva..."
                placeholderTextColor={Colors.textLight}
                value={tipoDeficiencia}
                onChangeText={setTipoDeficiencia}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Habilidades</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="code-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Separe por vírgula"
                placeholderTextColor={Colors.textLight}
                value={habilidades}
                onChangeText={setHabilidades}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Acessibilidade Necessária</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva os recursos de acessibilidade que você precisa"
                placeholderTextColor={Colors.textLight}
                value={acessibilidadeNecessaria}
                onChangeText={setAcessibilidadeNecessaria}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.salvarButton} 
            onPress={handleSalvar}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle" size={24} color={Colors.background} />
            <Text style={styles.salvarText}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deletarButton} onPress={handleDeletarConta}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
            <Text style={styles.deletarText}>Deletar minha conta</Text>
          </TouchableOpacity>
        </View>

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
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  textAreaContainer: {
    height: 100,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
  textArea: {
    height: 76,
    textAlignVertical: "top",
  },
  salvarButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 10,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  salvarText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  deletarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.error,
    gap: 10,
  },
  deletarText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.error,
  },
});