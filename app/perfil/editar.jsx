import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "../../constants/Colors";
// import { candidateService, authService } from "../../services/api";

export default function EditarPerfil() {
  const [nome, setNome] = useState("Patrick Castro");
  const [email, setEmail] = useState("patrickcastro@gmail.com");
  const [telefone, setTelefone] = useState("(11) 99999-9999");
  const [cidade, setCidade] = useState("São Paulo");
  const [tipoDeficiencia, setTipoDeficiencia] = useState("Física");
  const [habilidades, setHabilidades] = useState("React Native, JavaScript, Python, UX Design");
  const [experiencia, setExperiencia] = useState("2 anos em desenvolvimento mobile");
  const [formacao, setFormacao] = useState("Ciência da Computação - FIAP");
  const [loading, setLoading] = useState(false);

  // VERSÃO COM API (DESCOMENTAR DEPOIS):
  /*
  async function handleSalvar() {
    if (!nome || !email || !telefone || !cidade) {
      Alert.alert("Atenção", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      
      const dadosAtualizados = {
        name: nome,
        email: email,
        phone: telefone,
        city: cidade,
        disabilityType: tipoDeficiencia,
        skills: habilidades.split(",").map(s => s.trim()),
        experience: experiencia,
        education: formacao,
      };

      await candidateService.atualizar(user.userId, dadosAtualizados);

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
              const user = await authService.getCurrentUser();
              await candidateService.deletar(user.userId);
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
  */

  // VERSÃO FAKE (SEM API - USAR AGORA):
  function handleSalvar() {
    if (!nome || !email || !telefone || !cidade) {
      Alert.alert("Atenção", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    Alert.alert(
      "Sucesso",
      "Perfil atualizado com sucesso!",
      [{ text: "OK", onPress: () => router.back() }]
    );
  }

  function handleDeletarConta() {
    Alert.alert(
      "Deletar conta",
      "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Deletar", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Conta deletada",
              "Sua conta foi removida com sucesso.",
              [{ text: "OK", onPress: () => router.replace("/") }]
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Profissionais</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de Deficiência</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="accessibility-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Física, Visual, Auditiva"
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
            <Text style={styles.inputLabel}>Experiência</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva sua experiência"
                placeholderTextColor={Colors.textLight}
                value={experiencia}
                onChangeText={setExperiencia}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Formação</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="school-outline" size={20} color={Colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Sua formação acadêmica"
                placeholderTextColor={Colors.textLight}
                value={formacao}
                onChangeText={setFormacao}
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