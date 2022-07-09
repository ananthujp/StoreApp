import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import React, { useState } from "react";
import tw from "tailwind-rn";
import { Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { manipulateAsync } from "expo-image-manipulator";
const NewProduct = ({ route }) => {
  const userid = route.params.userid;
  const [image, setImage] = useState([]);
  const uploadFile = async () => {
    const response = await fetch(image[0].uri);
    const blob = await response.blob();
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/images1.jpg");
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
      quality: 1,
    });
    if (!result.cancelled) {
      const manipResult = await manipulateAsync(
        result.uri,
        [{ resize: { height: 200, width: 300 } }],
        {
          compress: 1,
        }
      );
      setImage([...image, { uri: manipResult.uri }]);
    }
  };
  return (
    <View style={tw("flex flex-col h-full")}>
      <View style={tw("flex flex-col h-1/3 bg-indigo-700")}></View>
      <View style={tw("flex flex-col ")}>
        <TextInput
          placeholder="Product Name"
          style={tw(
            "text-lg py-2 px-4 mx-2 my-4 border rounded-full border-gray-300 bg-gray-200 "
          )}
        />

        <View style={tw("flex flex-row")}>
          {image?.map((dc, i) => (
            <Image
              key={`picked.images.${i}`}
              source={{ uri: dc.uri }}
              style={tw("w-24 h-24 mx-2 border border-indigo-100")}
            />
          ))}
          <TouchableOpacity
            style={tw(
              "w-24 h-24 mx-2 border border-indigo-100 flex items-center justify-center"
            )}
            onPress={pickImage}
          >
            <Icon
              name="plus"
              type="antdesign"
              color={"gray"}
              style={tw(" text-gray-400 mr-2")}
              size={50}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={uploadFile}
          style={tw(
            "flex flex-row items-center my-3 bg-indigo-500 flex items-center px-4 py-2 mx-8 rounded-md "
          )}
        >
          <Icon
            name="plus"
            type="antdesign"
            color={"white"}
            style={tw(" text-gray-400 mr-2")}
            size={20}
          />
          <Text style={tw("ml-2 mr-2 text-white text-center")}>
            New Message
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewProduct;
