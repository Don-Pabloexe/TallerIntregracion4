import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db, storage } from '@/scripts/firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth.currentUser) {
            const fetchData = async () => {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setUser(userData);
                    setDisplayName(userData.displayName);
                    setPhotoURL(userData.photoURL);
                }
            };
            fetchData();
        }
    }, []);

    const handleSave = async () => {
        setLoading(true);
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            displayName: displayName,
            photoURL: photoURL
        });
        setLoading(false);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const imgRef = ref(storage, `profile/${auth.currentUser.uid}/photo.jpg`);
            const img = await fetch(result.uri);
            const bytes = await img.blob();
            await uploadBytes(imgRef, bytes);
            const downloadURL = await getDownloadURL(imgRef);
            setPhotoURL(downloadURL);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: photoURL || 'default-img-url' }} style={styles.image} />
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
            />
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <Button title="Save Profile" onPress={handleSave} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '100%'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    }
});
