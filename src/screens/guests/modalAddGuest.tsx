import { View, StyleSheet, Text, TextInput, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

interface Convidado {
  name: string;
  phone: string;
  email: string;
  companion?: Acompanhante[];
  numAcompanhantes: number;
}

interface Acompanhante {
  name: string;
  isChild: boolean;
}

interface Props {
  handleClose: () => void;
  eventId: string;
}

export default function ModalAddGuest({ handleClose, eventId }: Props) {
  const [acompanhantes, setAcompanhantes] = useState<Acompanhante[]>([]);
  const [guestName, setGuestName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handlePhoneChange = (text: string) => {
    // Remover qualquer caractere que não seja número
    let digitsOnly = text.replace(/\D/g, "");
  
    // Limitar a 11 dígitos (DD + número de telefone)
    if (digitsOnly.length > 11) {
      digitsOnly = digitsOnly.slice(0, 11);
    }
  
    // Aplicar a formatação somente quando o comprimento mínimo for atingido
    let formattedText = digitsOnly;
  
    if (formattedText.length > 2) {
      // Adicionar o parêntese de abertura e código de área
      formattedText = `(${formattedText.slice(0, 2)}) ${formattedText.slice(2)}`;
    }
    if (formattedText.length > 8) {
      // Adicionar o hífen no lugar certo quando o número completo estiver presente
      formattedText = `${formattedText.slice(0, 10)}-${formattedText.slice(10)}`;
    }
  
    setPhoneNumber(formattedText);
  };
  

  // Função para adicionar um novo acompanhante
  const adicionarAcompanhante = () => {
    setAcompanhantes([...acompanhantes, { name: '', isChild: false }]);
  };

  // Função para atualizar o nome do acompanhante
  const atualizarNome = (index: number, nome: string) => {
    const novosAcompanhantes = [...acompanhantes];
    novosAcompanhantes[index].name = nome;
    setAcompanhantes(novosAcompanhantes);
  };

  // Função para atualizar o status de "Criança ou Não"
  const atualizarCrianca = (index: number, isCrianca: boolean) => {
    const novosAcompanhantes = [...acompanhantes];
    novosAcompanhantes[index].isChild = isCrianca;
    setAcompanhantes(novosAcompanhantes);
  };

  const handleSave = async () => {
    try {
      const acompanhantesFiltrados = acompanhantes.filter(acompanhante => acompanhante.name.trim() !== '');

      const numAcompanhantes = acompanhantesFiltrados.length; // Número de acompanhantes

      const docRef = await firestore().collection('convidados').add({
        name: guestName,
        phone: phoneNumber,
        email: email,
        companion: acompanhantesFiltrados, // Salva apenas os acompanhantes com nome preenchido
        numAcompanhantes: numAcompanhantes, // Armazena o número de acompanhantes
        event: eventId,
      });
      console.log("Documento escrito com ID: ", docRef.id);

      handleClose();
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent} // Ajuste para distribuir o conteúdo corretamente
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Adicionar Convidado</Text>
        <TextInput style={styles.input}
          value={guestName}
          onChangeText={setGuestName}
          placeholder='Nome' />
        <TextInput style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          placeholder='Telefone'
          keyboardType="numeric"
          maxLength={15}
        />
        <TextInput style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder='E-mail' />

        {acompanhantes.map((acompanhante, index) => (
          <View key={index} style={styles.acompanhanteContainer}>
            <TextInput
              style={styles.input}
              placeholder='Nome do acompanhante'
              value={acompanhante.name}
              onChangeText={(text) => atualizarNome(index, text)} // Atualiza o nome
            />
            <View style={styles.switchContainer}>
              <Text>{acompanhante.isChild ? 'Criança' : 'Adulto'}</Text>
              <Switch
                value={acompanhante.isChild}
                onValueChange={(value) => atualizarCrianca(index, value)} // Atualiza se é criança
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={adicionarAcompanhante}>
          <Text style={styles.buttonText}>ADICIONAR ACOMPANHANTE</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text className='color-black'>CANCELAR</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>SALVAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Preenche toda a tela
    backgroundColor: 'rgba(24, 24, 24, 0.6)',
  },
  scrollContent: {
    flexGrow: 1, // Faz o conteúdo ocupar toda a tela
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    paddingVertical: 20, // Espaço vertical ao redor do conteúdo
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
  },
  acompanhanteContainer: {
    marginBottom: 20,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: 'rgba(34, 150, 243, 1)',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
