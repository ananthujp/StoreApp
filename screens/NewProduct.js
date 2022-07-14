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
import { db, storage } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import * as Progress from "react-native-progress";
import CircularProgress from "react-native-circular-progress-indicator";
import { manipulateAsync } from "expo-image-manipulator";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";
const NewProduct = ({ route }) => {
  const userid = route.params.userid;
  const [image, setImage] = useState([]);
  const [load, setLoad] = useState(false);
  const [prod_name, setProdName] = useState();
  const [prod_desc, setProdDesc] = useState();
  const [prod_loc, setProdLoc] = useState();
  const [comp, setComp] = useState(false);
  const [value, setValue] = useState(0);
  const [prodID, setProdId] = useState(0);
  const [value2, setValue2] = useState();
  const [title, setTitle] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    value === 100 && setComp(true);
  }, [value]);
  useEffect(() => {
    switch (value2) {
      case 0:
        setValue(value + 75 / image.length);
        break;
      case 1:
        setValue(value + 75 / image.length);
        break;
      case 2:
        setValue(value + 75 / image.length);
        break;
      case 3:
        setValue(value + 75 / image.length);
        break;
      default:
    }
  }, [value2]);
  const createProduct = () => {
    setLoad(true);
    setValue(2);
    setTitle("Creating document..");
    prod_name &&
      prod_desc &&
      prod_loc &&
      image.length > 0 &&
      addDoc(collection(db, "Products"), {
        name: prod_name,
        desc: prod_desc,
        loc: prod_loc,
        user: userid,
      }).then((dic) => {
        setValue(25);
        setTitle("Uploading Images..");
        //uploadFile(dic.id, image.length - 1, image.length);
        //image.map((img, i) => uploadFile(dic.id, img, i));
        setProdId(dic.id);
        Promise.all(
          image.map(
            (im, i) =>
              fetch(im.uri).then((dc) => {
                dc.blob().then((blob) =>
                  uploadBytes(
                    ref(storage, `products/${dic.id}/images${i}.jpg`),
                    blob,
                    {
                      contentType: "image/jpeg",
                    }
                  ).then((dc) => {
                    getDownloadURL(
                      ref(storage, `products/${dic.id}/images${i}.jpg`)
                    ).then((downloadURL) => {
                      //console.log(i, downloadURL);
                      updateDoc(
                        doc(db, "Products", dic.id),
                        { images: arrayUnion(downloadURL) },
                        { merge: true }
                      ).finally(() => setValue2(i));
                    });
                  })
                );
              })
            //.finally(() => console.log(`Final.Done${i}`))
          )
        );
      });
  };
  const uploadFile = async (id, im, i) => {
    //setTitle(`Uploading Images..`);
    //console.log("stage 1");
    //setTitle(`Uploading Image ${n - i}..`);
    //const response = await fetch(image[i].uri);
    //const blob = await response.blob();
    fetch(im.uri)
      .then((dc) => {
        dc.blob().then((blob) => {
          const metadata = {
            contentType: "image/jpeg",
          };
          uploadBytesResumable(
            ref(storage, `products/${id}/images${i}.jpg`),
            blob,
            metadata
          ).then((dc) => {
            getDownloadURL(ref(storage, `products/${id}/images${i}.jpg`)).then(
              (downloadURL) => {
                console.log(i, downloadURL);
                updateDoc(
                  doc(db, "Products", id),
                  { images: arrayUnion(downloadURL) },
                  { merge: true }
                );
              }
            );
          });
        });
      })
      .then(() => console.log(`Done${i}`));
  };

  const pickImage = async () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then(
      (result) =>
        !result.cancelled &&
        manipulateAsync(result.uri, [{ resize: { height: 200, width: 300 } }], {
          compress: 1,
        }).then((dc) =>
          setImage([...image, { id: image.length, uri: dc.uri, prog: 0 }])
        )
    );
  };

  return !comp ? (
    <ScrollView keyboardShouldPersistTaps="handled" style={tw("flex flex-col")}>
      <View
        style={tw(
          "flex flex-col items-center justify-center bg-indigo-700 py-4"
        )}
      >
        <CircularProgress
          value={value}
          radius={120}
          valueSuffix={"%"}
          title={title}
          titleColor={"white"}
          titleStyle={tw("text-sm -mt-2")}
          //   progressValueColor={"#ecf0f1"}
          //   activeStrokeColor={"#f39c12"}
          //   inActiveStrokeColor={"#9b59b6"}
          inActiveStrokeOpacity={0.5}
          inActiveStrokeWidth={20}
          activeStrokeWidth={30}
        />
      </View>

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
    </ScrollView>
  ) : (
    <>
      <View
        style={tw(
          "flex flex-col items-center justify-center bg-indigo-700 h-full"
        )}
      >
        <Icon name="checkcircle" type="antdesign" color="white" size={120} />
        <Text style={tw("text-3xl font-bold text-white mt-6")}>Done</Text>
        <Text style={tw("text-xs font-bold text-white mt-6")}>
          Your product is added successfully.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductScreen", { data: prodID })}
        >
          <Text
            style={tw(
              "text-xs font-bold text-indigo-600 mt-6 px-3 py-2 bg-white rounded-full"
            )}
          >
            View product
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default NewProduct;
