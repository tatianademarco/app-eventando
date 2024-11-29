import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import firestore from '@react-native-firebase/firestore';

interface Supplier {
    name: string;
    observation: string;
    value: number | undefined;
    contact: string;
    type: 'total' | 'porConvidado';
    methodPayment: string;
}

interface Service {
    service: string;
    suppliers: Supplier[];
}

interface Props {
    handleClose: () => void;
    serviceName: string;
    eventId: string;
}

export default function ModalAddService({ handleClose, serviceName, eventId }: Props) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [valueFormatted, setValueFormatted] = useState<any>();
    const [value, setValue] = useState<number>();
    const [name, setName] = useState<string>('');
    const [contact, setContact] = useState<string>('');
    const [payment, setPayment] = useState<string>('');
    const [obs, setObs] = useState<string>('');
    const [type, setType] = useState<any>();

    // Função para adicionar um novo fornecedor
    const adicionarFornecedor = () => {
        const calculatedType = selectedIndex === 0 ? 'total' : 'porConvidado';

    // Cria um novo fornecedor
    const newSupplier: Supplier = { 
        name, 
        observation: obs || '', 
        value: value || 0, 
        contact, 
        type: calculatedType,  // Usa o valor calculado
        methodPayment: payment || '' 
    };

    // Atualiza a lista de fornecedores localmente
    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);

    // Atualiza os serviços com os fornecedores atualizados
    const updatedServices = [...services, { service: serviceName, suppliers: updatedSuppliers }];
    setServices(updatedServices);

    console.log(updatedSuppliers); // Verifica se os fornecedores estão corretos
    console.log(updatedServices); // Verifica se os serviços estão corretos

    // Salva os dados no Firestore
    handleSave(updatedSuppliers);

    // Limpa os campos
    setName('');
    setObs('');
    setValue(undefined);
    setContact('');
    setPayment('');
    setType(undefined);
};


// Função para formatar o valor como moeda (R$ 0,00)
const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, ''); // Remove tudo que não for número
    const formattedValue = (Number(numericValue) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    setValue(Number(numericValue) / 100);
    return formattedValue;
};

// Função para atualizar o valor com formatação
const handleValueChange = (text: string) => {
    setValueFormatted(formatCurrency(text)); // Formata e atualiza o valor
};

const handleSave = async (updatedSuppliers: Supplier[]) => {
    try {
        // Busca o serviço existente pelo nome e pelo eventId
        const querySnapshot = await firestore()
            .collection('services')
            .where('event', '==', eventId)
            .where('service', '==', serviceName)
            .get();

        if (!querySnapshot.empty) {
            // Se o serviço já existe, pega o primeiro documento encontrado (deve ser único)
            const doc = querySnapshot.docs[0];
            const existingSuppliers = doc.data().suppliers;

            // Atualiza os fornecedores existentes (adicione os novos fornecedores)
            const allSuppliers = [...existingSuppliers, ...updatedSuppliers];

            // Atualiza o documento com a nova lista de fornecedores
            await firestore().collection('services').doc(doc.id).update({
                suppliers: allSuppliers,
            });

            console.log("Serviço atualizado com sucesso");

        } else {
            // Se não encontrar o serviço, cria um novo documento
            const docRef = await firestore().collection('services').add({
                event: eventId,
                service: serviceName,
                suppliers: updatedSuppliers,
            });
            console.log("Novo serviço adicionado com ID: ", docRef.id);
        }

        // Fecha o modal após salvar
        handleClose();
    } catch (e) {
        console.error("Erro ao adicionar ou atualizar documento: ", e);
    }
};



return (
    <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent} // Ajuste para distribuir o conteúdo corretamente
    >
        <View style={styles.modalContent}>
            <Text style={styles.title}> {serviceName} - Proposta 1</Text>
            <TextInput style={styles.input}
                placeholder='Nome da empresa'
                value={name}
                onChangeText={setName}
            />
            <TextInput style={styles.input} placeholder='Contato'
                value={contact}
                onChangeText={setContact}
            />
            <TextInput style={styles.input} placeholder='Método de pagamento'
                value={payment}
                onChangeText={setPayment}
            />
            <TextInput
                style={{
                    height: 50,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 7,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    width: '100%',
                }}
                placeholder='Valor do serviço (total ou por convidado)'
                value={valueFormatted} // Valor formatado
                keyboardType='numeric' // Somente números
                onChangeText={handleValueChange} // Chama a função de formatação
            />
            <SegmentedControl
                values={['Total', 'Por Convidado']}
                selectedIndex={selectedIndex}
                onChange={(event) => {
                    const selectedSegmentIndex = event.nativeEvent.selectedSegmentIndex;
                    setSelectedIndex(selectedSegmentIndex);  // Atualiza o índice selecionado
                }}
                style={{ marginBottom: 15, width: '100%' }}  // Certifique-se de aplicar estilo para visibilidade
            />
            <TextInput style={styles.input}
                placeholder='Observação'
                value={obs}
                onChangeText={setObs}
            />

            <TouchableOpacity style={styles.addButton} onPress={adicionarFornecedor}>
                <Text style={styles.buttonText}>ADICIONAR OUTRA PROPOSTA</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                    <Text className='color-black'>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={adicionarFornecedor} style={styles.saveButton}>
                    <Text style={styles.buttonText}>SALVAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView >
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