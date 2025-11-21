import { Text, TextInput, StyleSheet, View, Alert, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { Colors } from "../constants/Colors";
import { userService, authService, candidateService } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoDeficiencia, setTipoDeficiencia] = useState("PHYSICAL");
  const [habilidades, setHabilidades] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [acessibilidadeNecessaria, setAcessibilidadeNecessaria] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  // LIMPA TUDO quando a tela carrega
  useEffect(() => {
    limparTudo();
  }, []);

  async function limparTudo() {
    try {
      console.log('🧹 Limpando AsyncStorage ao entrar na tela de cadastro...');
      await AsyncStorage.clear();
      console.log('✅ AsyncStorage limpo!');
    } catch (error) {
      console.error('Erro ao limpar AsyncStorage:', error);
    }
  }

  async function handleCadastrar() {
    // Validações
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
        console.log('=== GARANTINDO LIMPEZA TOTAL ===');
        await AsyncStorage.clear();
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('✅ Tudo limpo antes de criar usuário');

        // 1. Criar usuário SEM estar logado
        const dadosUsuario = {
            name: nome.trim(),
            email: email.trim().toLowerCase(),
            password: senha,
            userRole: "CANDIDATE",
            city: (cidade && cidade.trim()) || "São Paulo",
            state: (estado && estado.trim()) || "SP",
            phone: (telefone && telefone.trim()) || "11999999999"
        };

        console.log('=== CRIANDO USUÁRIO ===');
        const userResponse = await userService.criar(dadosUsuario);
        console.log('✅ Usuário criado:', userResponse.id);
        
        const userId = userResponse.id;

        // 2. Fazer login
        console.log('=== FAZENDO LOGIN ===');
        await authService.login(email.trim().toLowerCase(), senha);
        
        // 3. Aguardar token ser salvo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('Token não foi salvo. Faça login manualmente.');
        }
        
        console.log('✅ Login efetuado');

        // 4. Criar perfil de candidato
        const dadosCandidato = {
            userId: userId,
            disabilityType: tipoDeficiencia,
            skills: (habilidades && habilidades.trim()) || "Não informado",
            experience: (experiencia && experiencia.trim()) || "Não informado",
            requiredAcessibility: (acessibilidadeNecessaria && acessibilidadeNecessaria.trim()) || "Não informado"
        };

        console.log('=== CRIANDO PERFIL CANDIDATO ===');
        const candidateResponse = await candidateService.criar(dadosCandidato);
        console.log('✅ Perfil candidato criado:', candidateResponse.id);
        
        await AsyncStorage.setItem('candidateId', candidateResponse.id.toString());

        Alert.alert(
            "Sucesso",
            "Cadastro realizado com sucesso!",
            [
                {
                    text: "OK",
                    onPress: () => router.replace("/(tabs)/home")
                }
            ]
        );

    } catch (error) {
        console.error('=== ERRO ===');
        console.error('Mensagem:', error.message);
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        
        let mensagemErro = "Não foi possível criar a conta.";
        
        if (error.response?.status === 401) {
            mensagemErro = "Problema de autenticação no backend. Use o Insomnia para criar o usuário e depois faça login no app.";
        } else if (error.response?.status === 409) {
            mensagemErro = "Este e-mail já está cadastrado. Tente fazer login.";
        } else if (error.response?.status === 400) {
            mensagemErro = error.response?.data?.message || "Dados inválidos. Verifique todos os campos.";
        }
        
        Alert.alert("Erro", mensagemErro, [{ text: "OK" }]);
        
    } finally {
        setLoading(false);
    }
}

  function voltarParaLogin() {
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.backgroundGradient}>
              <View style={styles.circle1} />
              <View style={styles.circle2} />
              <View style={styles.circle3} />
            </View>

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
              <Text style={styles.formTitle}>Dados Pessoais</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor={Colors.textLight}
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
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
                    name={senhaVisivel ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
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
                    name={confirmarSenhaVisivel ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telefone (opcional)"
                  placeholderTextColor={Colors.textLight}
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputContainer, styles.inputHalf]}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={Colors.textLight}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Cidade (opcional)"
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
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Perfil Profissional</Text>

              <View style={styles.pickerContainer}>
                <Ionicons
                  name="accessibility-outline"
                  size={20}
                  color={Colors.textLight}
                  style={styles.inputIcon}
                />
                <Picker
                  selectedValue={tipoDeficiencia}
                  style={styles.picker}
                  onValueChange={(itemValue) => setTipoDeficiencia(itemValue)}
                  dropdownIconColor={Colors.white}
                >
                  <Picker.Item label="Deficiência Física" value="PHYSICAL" />
                  <Picker.Item label="Deficiência Visual" value="VISUAL" />
                  <Picker.Item label="Deficiência Auditiva" value="AUDITORY" />
                  <Picker.Item label="Deficiência Cognitiva" value="COGNITIVE" />
                </Picker>
              </View>

              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Habilidades (opcional)"
                  placeholderTextColor={Colors.textLight}
                  value={habilidades}
                  onChangeText={setHabilidades}
                  multiline
                />
              </View>

              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Experiência Profissional (opcional)"
                  placeholderTextColor={Colors.textLight}
                  value={experiencia}
                  onChangeText={setExperiencia}
                  multiline
                />
              </View>

              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Acessibilidade Necessária (opcional)"
                  placeholderTextColor={Colors.textLight}
                  value={acessibilidadeNecessaria}
                  onChangeText={setAcessibilidadeNecessaria}
                  multiline
                />
              </View>
            </View>

            {loading ? (
              <View style={styles.botaoCadastrar}>
                <ActivityIndicator size="small" color={Colors.background} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.botaoCadastrar}
                onPress={handleCadastrar}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoTexto}>Criar minha conta</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={Colors.background}
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            )}

            <View style={styles.termos}>
              <Text style={styles.termosTexto}>
                Ao criar uma conta, você concorda com nossos{" "}
                <Text style={styles.termosLink}>Termos de Uso</Text>
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Já tem uma conta?{" "}
                <Text style={styles.footerLink} onPress={voltarParaLogin}>
                  Faça login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingBottom: 30,
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
    marginTop: 10,
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
  pickerContainer: {
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
  picker: {
    flex: 1,
    color: Colors.white,
  },
  textAreaContainer: {
    height: 100,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  textArea: {
    height: 76,
    textAlignVertical: "top",
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