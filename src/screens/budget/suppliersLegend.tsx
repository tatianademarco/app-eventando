import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';

export default function SuppliersLegend() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ margin: 0 }}>
      {/* Botão para abrir a legenda */}
      <Pressable onPress={() => setModalVisible(true)} className='items-end'>
      <Feather name="help-circle" size={24} color="#007BFF" />
      </Pressable>

      {/* Modal com a legenda */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Instruções para Fornecedores</Text>
            <Text style={styles.modalText}>
              - Selecione ou crie um serviço para a sua festa (ex: Buffet, Decoração).
            </Text>
            <Text style={styles.modalText}>
              - Adicione os fornecedores pesquisados e seus preços correspondentes.
            </Text>
            <Text style={styles.modalText}>
              - Compare os preços e finalize a contratação confirmando o fornecedor escolhido.
            </Text>

            {/* Botão para fechar a legenda */}
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
