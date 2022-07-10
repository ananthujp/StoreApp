import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import * as Progress from "react-native-progress";
import { manipulateAsync } from "expo-image-manipulator";
const NewProduct = ({ route }) => {
  const userid = route.params.userid;
  const [image, setImage] = useState([]);
  const [load, setLoad] = useState(false);
  const [prod_name, setProdName] = useState();
  const [prod_desc, setProdDesc] = useState();
  const [prod_loc, setProdLoc] = useState();
  const createProduct = () => {
    prod_name && prod_desc && prod_loc && image.length > 0
      ? console.log("Set")
      : console.log("Nops");
  };
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
      setImage([...image, { id: image.length, uri: manipResult.uri }]);
    }
  };
  return (
    <View style={tw("flex flex-col h-full")}>
      <View style={tw("flex flex-col h-1/3 bg-indigo-700")}></View>

      <View style={tw("flex flex-col")}>
        <TextInput
          value={prod_name}
          onChangeText={(value) => setProdName(value)}
          underlineColorAndroid="transparent"
          placeholder="Product Name"
          style={tw(
            " font-bold py-2 px-4 mx-2 mt-4 mb-1 border rounded-md border-gray-300 bg-gray-200 "
          )}
        />
        <TextInput
          value={prod_desc}
          onChangeText={(value) => setProdDesc(value)}
          underlineColorAndroid="transparent"
          multiline={true}
          placeholder="Product Description"
          style={[
            tw(
              " py-2 px-4 mx-2 my-1 border rounded-md border-gray-300 bg-gray-200 "
            ),
            { minHeight: "10%" },
          ]}
        />
        <Text style={tw("mx-4 text-gray-500 mt-2")}>Product Images</Text>
        <View style={tw("flex mx-2  flex-row mt-1")}>
          {image?.map((dc, i) => (
            <View
              key={`picked.images.${i}`}
              style={tw("flex relative border-2 border-indigo-100 mx-2 ")}
            >
              <Image source={{ uri: dc.uri }} style={tw("w-20 h-20")} />
              <TouchableOpacity
                onPress={() =>
                  setImage(image.filter((item) => item.id !== dc.id))
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="close" type="antdesign" color={"white"} size={20} />
              </TouchableOpacity>
            </View>
          ))}
          {image?.length < 4 && (
            <TouchableOpacity
              style={tw(
                "w-20 h-20 mx-2 border border-indigo-100 flex items-center justify-center"
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
          )}
        </View>
        <TextInput
          value={prod_loc}
          onChangeText={(value) => setProdLoc(value)}
          underlineColorAndroid="transparent"
          placeholder="Location {example : Hiqom Hostel}"
          style={tw(
            " py-2 px-4 mx-2 mt-4 mb-1 border rounded-md border-gray-300 bg-gray-200 "
          )}
        />
        <TouchableOpacity
          onPress={createProduct}
          style={[
            tw(
              "flex flex-row items-center my-3 bg-indigo-500 flex items-center px-6 h-12 rounded-md "
            ),
            { marginLeft: "auto", marginRight: "auto" },
          ]}
        >
          {load ? (
            <Progress.CircleSnail
              style={tw(" mr-2 rounded-lg items-center")}
              size={25}
              color={["red"]}
            />
          ) : (
            <Icon
              name="plus"
              type="antdesign"
              color={"white"}
              style={tw(" text-gray-400 mr-2")}
              size={20}
            />
          )}
          <Text style={tw("text-white text-center")}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewProduct;
