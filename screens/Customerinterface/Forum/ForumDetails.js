import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Touchable,
  ActivityIndicator, // Added for loading states
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import LottieView from "lottie-react-native";
// ------------------------------------------------------------------
// UPDATED IMPORT: Use @tanstack/react-query instead of react-query
import { useMutation } from "@tanstack/react-query";
// ------------------------------------------------------------------

import axios from "axios";
import Toast from "react-native-toast-message";

import {
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
import { formatDateandTime } from "../../../utils/DateTime";
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  Get_My_Clan_Forum_Fun,
  Get_My_Clan_Single_Forum_Fun,
  reset__single_forum,
} from "../../../Redux/UserSide/ForumSlice";
import ForumModal from "../../../components/Forum/ForumModal";
import { CenterReuseModals } from "../../../components/shared/ReuseModals";
import {
  CustomTextArea,
  Formbutton,
  Forminput,
} from "../../../components/shared/InputForm";
import { API_CONFIG } from "../../../api";

const API_BASEURL = API_CONFIG?.BASE_URL;
console.log({
  tyyy: API_BASEURL,
});

const ForumDetails = () => {
  const maindata = useRoute()?.params;

  const { get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice,
  );

  let forumid = maindata?._id;

  const deleteDate = () => {
    // Check if mutation is not pending before calling mutate
    if (!Delete_Mutation.isPending) {
      Delete_Mutation.mutate();
    }
  };

  let dataDetails = [
    {
      id: "1",
      title: "Delete this post",
      description: "This announcement will be deleted instantly",
      img: require("../../../assets/images/trash.png"),
      action: () => deleteDate(),
    },
  ];

  const { user_data } = useSelector((state) => state.AuthSlice);

  const navigation = useNavigation();
  const animation = useRef(null);
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [newcomment, setNewcomment] = useState("");

  const [showComments, setShowComments] = useState(false); // Step 1
  const [commentInput, setCommentInput] = useState(""); // Step 3: State for user input

  const handleTextChange = (newText) => {
    setNewcomment(newText);
  };

  const toggleComments = () => {
    setShowComments(!showComments); // Step 2
    setNewModalVisible(true);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { get_my_clan_single_forum_data } = useSelector(
    (state) => state?.ForumSlice,
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Ensure forumid is present before dispatching
    if (forumid) {
      dispatch(Get_My_Clan_Single_Forum_Fun(forumid)).finally(() =>
        setRefreshing(false),
      );
    } else {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (forumid) {
      dispatch(Get_My_Clan_Single_Forum_Fun(forumid));
    }
    return () => {
      // dispatch(reset__single_forum(null)); // Assuming you want to reset state on unmount
    };
  }, [dispatch, forumid]);

  // ------------------------------------------------------------------
  // 1. TanStack Query useMutation for Like
  // ------------------------------------------------------------------
  const Like_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}forum/like/${data_info?.clanId}/${data_info?.forumid}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.get(url, config);
    },
    onSuccess: (success) => {
      // Refetch the single forum data to update the likes count
      if (forumid) {
        dispatch(Get_My_Clan_Single_Forum_Fun(forumid));
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message || "Failed to like post"} `,
      });
    },
  });

  // ------------------------------------------------------------------
  // 2. TanStack Query useMutation for Delete
  // ------------------------------------------------------------------
  const Delete_Mutation = useMutation({
    mutationFn: () => {
      let url = `${API_BASEURL}forum/user/${forumid}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.delete(url, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Post deleted successfully",
      });
      // Optionally refetch all forums
      dispatch(Get_My_Clan_Forum_Fun());
      navigation.goBack();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message || "Failed to delete post"} `,
      });
    },
  });

  // ------------------------------------------------------------------
  // 3. TanStack Query useMutation for Comment
  // ------------------------------------------------------------------
  const Comment_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}forum/comment`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Comment successfully posted",
      });
      // Refetch the single forum data to update the comments list
      if (forumid) {
        dispatch(Get_My_Clan_Single_Forum_Fun(forumid));
      }
      setNewcomment(""); // Clear input
      setNewModalVisible(false); // Close modal
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message || "Failed to post comment"} `,
      });
    },
  });

  const handleLike = () => {
    const postData = get_my_clan_single_forum_data?.data;
    if (postData && !Like_Mutation.isPending) {
      Like_Mutation.mutate({
        forumid: postData._id,
        clanId: postData.clan,
      });
    }
  };

  const handleCommentSubmit = () => {
    if (newcomment.trim() && !Comment_Mutation.isPending) {
      Comment_Mutation.mutate({
        content: newcomment.trim(),
        postId: get_my_clan_single_forum_data?.data?._id,
      });
    }
  };

  // Check if current user has already liked the post
  const isLiked = get_my_clan_single_forum_data?.data?.likes?.includes(
    get_user_profile_data?.user?._id,
  );

  // Check if current user is the post creator
  const isCurrentUserCreator =
    maindata?.user === get_user_profile_data?.user?._id;

  // Render function for comments (if needed for better styling/structure)
  const renderComment = ({ comment }) => (
    <View
      style={{
        marginVertical: 5,
        paddingHorizontal: 30,
      }}
      key={comment._id}
    >
      <View
        style={{
          paddingHorizontal: 15,
          backgroundColor: "#DAE4EF",
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
          }}
        >
          {comment?.user?.name}
        </Text>
        <Text style={{ marginTop: 2 }}>{comment?.content}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing || Delete_Mutation.isPending}
          onRefresh={onRefresh}
        />
      }
      style={{ flex: 1 }}
    >
      {/* Loading state for single forum data fetch */}
      {/* Assuming Get_My_Clan_Single_Forum_Fun sets a loading state in Redux, 
          which is not visible here but should be handled globally or locally. 
          We handle mutation loading states below. */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={{
              uri: maindata?.user?.photo || "default_user_icon_url", // Provide a fallback
            }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />

          <View>
            <MediumFontText
              data={maindata?.user?.name}
              textstyle={{ fontSize: 16, fontWeight: "500" }}
            />

            <LightFontText
              data={formatDateandTime(
                get_my_clan_single_forum_data?.data?.createdAt,
              )}
              textstyle={{ fontSize: 12, fontWeight: "300" }}
            />
          </View>
        </View>
        {isCurrentUserCreator && (
          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 2,
              borderRadius: 6,
            }}
            onPress={toggleModal}
            disabled={Delete_Mutation.isPending}
          >
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <RegularFontText
          data={get_my_clan_single_forum_data?.data?.content}
          textstyle={{
            fontSize: 12,
            fontWeight: "400",
            textAlign: "justify",
          }}
        />
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#D9D9D9",
          marginVertical: 10,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
          paddingHorizontal: 30,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            opacity: Like_Mutation.isPending ? 0.6 : 1,
          }}
          onPress={handleLike}
          disabled={Like_Mutation.isPending}
        >
          {isLiked ? (
            <AntDesign name="heart" size={24} color="red" />
          ) : (
            <AntDesign name="hearto" size={24} color="black" />
          )}
          <Text>
            {get_my_clan_single_forum_data?.data?.likes?.length} Likes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
          onPress={toggleComments}
        >
          <AntDesign name="message1" size={24} color="black" />
          <Text>Comment </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 10 }}>
        {get_my_clan_single_forum_data?.data?.comments?.length === 0 ? (
          <View style={{ paddingHorizontal: 20, alignItems: "center" }}>
            <LottieView
              autoPlay
              ref={animation}
              style={{ width: 200, height: 200 }}
              source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
            />
            <Text>No Comment Available</Text>
          </View>
        ) : (
          <FlatList
            data={get_my_clan_single_forum_data?.data?.comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => renderComment({ comment: item })}
            scrollEnabled={false} // Since this is inside a ScrollView
          />
        )}
      </View>

      {/* Comment Modal */}
      <CenterReuseModals
        visible={newModalVisible}
        onClose={() => setNewModalVisible(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            elevation: 5,
            width: "90%",
            height: "auto", // Adjusted height to be flexible
            maxHeight: "60%",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
            }}
            onPress={() => setNewModalVisible(false)}
          >
            <MaterialIcons name="cancel" size={30} color="gray" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            Send Comment
          </Text>

          <CustomTextArea
            placeholder="Enter comment here..."
            value={newcomment}
            onChangeText={handleTextChange}
            inputStyle={{
              textAlignVertical: "top",
              padding: 10,
              backgroundColor: "#F6F8FAE5",
              height: 100,
              borderRadius: 6,
              fontSize: 16,
              marginTop: 10,
            }}
          />

          <Formbutton
            buttonStyle={{
              backgroundColor: Comment_Mutation.isPending
                ? "#90ee90"
                : "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
              marginTop: 20,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 14,
            }}
            data="Submit Comment"
            onPress={handleCommentSubmit}
            // Use Comment_Mutation.isPending for TanStack Query v4/v5
            isLoading={Comment_Mutation.isPending}
          />
        </View>
      </CenterReuseModals>

      {/* Delete Confirmation Modal */}
      <ForumModal visible={isModalVisible} onClose={toggleModal}>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            width: "100%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: "auto",
          }}
        >
          {dataDetails.map((item) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                paddingVertical: 10,
                gap: 10,
                opacity: Delete_Mutation.isPending ? 0.6 : 1,
              }}
              key={item.id}
              onPress={item.action}
              disabled={Delete_Mutation.isPending}
            >
              <Image
                source={item?.img}
                style={{ width: 30, height: 30, tintColor: "red" }}
              />

              <View style={{ flex: 1 }}>
                <MediumFontText
                  data={item.title}
                  textstyle={{ fontSize: 16, fontWeight: "500", color: "red" }}
                />

                <RegularFontText data={item.description} />
              </View>
              {Delete_Mutation.isPending && (
                <ActivityIndicator size="small" color="red" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={toggleModal}
            style={{
              marginTop: 10,
              padding: 10,
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ForumModal>
    </ScrollView>
  );
};

export default ForumDetails;
