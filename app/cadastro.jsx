import { Text, TextInput, StyleSheet, View, Alert, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { userService, authService, candidateService } from "../services/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCadastrar() {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // 1. Criar usuário
      const dadosUsuario = {
        name: nome,
        email: email,
        password: senha,
        userRole: "CANDIDATE",
        city: cidade || "São Paulo",
        state: estado || "SP",
        phone: telefone || "(11) 00000-0000"
      };

      const userResponse = await userService.criar(dadosUsuario);
      const userId = userResponse.id;

      // 2. Fazer login para obter token
      await authService.login(email, senha);

      // 3. Criar perfil de candidato
      const dadosCandidato = {
        userId: userId,
        disabilityType: "NOT_INFORMED",
        skills: "",
        requiredAcessibility: ""
      };

      const candidateResponse = await candidateService.criar(dadosCandidato);
      
      // Salvar candidateId no AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('candidateId', candidateResponse.id.toString());
      
      Alert.alert(
        "Sucesso", 
        "Cadastro realizado com sucesso! Complete seu perfil para aumentar suas chances.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home")
          }
        ]
      );
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      
      if (error.response?.status === 400) {
        Alert.alert(
          "Erro", 
          "Este e-mail já está cadastrado. Tente fazer login."
        );
      } else {
        Alert.alert(
          "Erro", 
          "Não foi possível criar a conta. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function voltarParaLogin() {
    router.replace("/");
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.backgroundGradient}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            
            <TouchableOpacity style={styles.backButton} onPress={voltarParaLogin}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <Text style={styles.brandName}>Criar Conta</Text>
              <Text style={styles.subtitle}>
                Junte-se ao Acessly e encontre oportunidades inclusivas
              </Text>
            </View>

            <View style={styles.formCard}>
              
              <Text style={styles.formTitle}>Seus dados</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo *"
                  placeholderTextColor={Colors.textLight}
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu e-mail *"
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="call" size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Telefone"
                  placeholderTextColor={Colors.textLight}
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputContainer, styles.inputHalf]}>
                  <Ionicons name="location" size={20} color={Colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Cidade"
                    placeholderTextColor={Colors.textLight}
                    value={cidade}
                    onChangeText={setCidade}
                  />
                </View>

                <View style={[styles.inputContainer, styles.inputSmall]}>
                  <TextInput
                    style={styles.input}
                    placeholder="UF"
                    placeholderTextColor={Colors.textLight}
                    value={estado}
                    onChangeText={setEstado}
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha (mín. 6 caracteres) *"
                  placeholderTextColor={Colors.textLight}
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!senhaVisivel}
                />
                <TouchableOpacity 
                  onPress={() => setSenhaVisivel(!senhaVisivel)} 
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={senhaVisivel ? "eye" : "eye-off"} 
                    size={22} 
                    color={Colors.textLight} 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha *"
                  placeholderTextColor={Colors.textLight}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!confirmarSenhaVisivel}
                />
                <TouchableOpacity 
                  onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)} 
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={confirmarSenhaVisivel ? "eye" : "eye-off"} 
                    size={22} 
                    color={Colors.textLight} 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.botaoCadastrar, loading && styles.botaoDisabled]} 
                onPress={handleCadastrar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.background} />
                ) : (
                  <>
                    <Text style={styles.botaoTexto}>Criar minha conta</Text>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.background} style={styles.arrowIcon} />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.termos}>
                <Text style={styles.termosTexto}>
                  Ao criar uma conta, você concorda com nossos{" "}
                  <Text style={styles.termosLink}>Termos de Uso</Text>
                </Text>
              </View>

            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Já tem uma conta?{" "}
                <Text style={styles.footerLink} onPress={voltarParaLogin}>Faça login</Text>
              </Text>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.primary,
    opacity: 0.12,
    top: -150,
    right: -100,
    transform: [{ scale: 1.5 }],
  },
  circle2: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: Colors.secondary,
    opacity: 0.1,
    bottom: -100,
    left: -80,
  },
  circle3: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.accent,
    opacity: 0.08,
    top: 250,
    right: -50,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  brandName: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textLight,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 28,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputSmall: {
    width: 80,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.white,
  },
  eyeButton: {
    padding: 8,
  },
  botaoCadastrar: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  botaoDisabled: {
    opacity: 0.7,
  },
  botaoTexto: {
    color: Colors.background,
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  termos: {
    marginTop: 16,
    alignItems: "center",
  },
  termosTexto: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
  termosLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  footerText: {
    color: Colors.textLight,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});