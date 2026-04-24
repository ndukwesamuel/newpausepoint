import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import {
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import {
  MediumFontText,
  RegularFontText,
  LightFontText,
} from "../../../components/shared/Paragrahp";
import { formatDateandTime } from "../../../utils/DateTime";
import ForumModal from "../../../components/Forum/ForumModal";
import { CenterReuseModals } from "../../../components/shared/ReuseModals";
import { CustomTextArea } from "../../../components/shared/InputForm";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

const ForumDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const animation = useRef(null);
  const maindata = route?.params;
  const forumId = maindata?._id;

  console.log({
    yyyy: forumId,
  });

  const { get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice,
  );

  const [isModalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newcomment, setNewcomment] = useState("");

  // ── Fetch forum detail ───────────────────────────────────
  const {
    data: forumData,
    isLoading,
    refetch,
  } = useFetchData_v2(`api/v1/forum/${forumId}`, `forum-${forumId}`);

  const post = forumData?.data || forumData;

  // ── Like mutation ────────────────────────────────────────
  const likeMutation = useMutateData_v2(
    "api/v1/forum/like",
    "PATCH",
    [`forum-${forumId}`],
    {
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Failed to like post",
        });
      },
    },
  );

  // ── Comment mutation ─────────────────────────────────────
  const commentMutation = useMutateData_v2(
    "api/v1/forum/comment",
    "POST",
    [`forum-${forumId}`],
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Comment posted",
        });
        setNewcomment("");
        setCommentModalVisible(false);
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Failed to post comment",
        });
      },
    },
  );

  // ── Delete mutation ──────────────────────────────────────
  const deleteMutation = useMutateData_v2(
    `api/v1/forum/${forumId}`,
    "DELETE",
    undefined,
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Post deleted successfully",
        });
        navigation.goBack();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Failed to delete post",
        });
      },
    },
  );

  // ── Derived state ────────────────────────────────────────
  const isLiked = post?.likes?.includes(get_user_profile_data?.user?._id);

  console.log({
    user_info: maindata?.user?._id,
    aaaaa: get_user_profile_data?.data?._id,
    xxxx: get_user_profile_data?.data?.user?._id,
  });

  const isOwner = maindata?.user?._id === get_user_profile_data?.data?._id;
  //  ||
  // maindata?.user === get_user_profile_data?.user?._id;

  const handleLike = () => {
    if (!likeMutation.isPending) {
      likeMutation.mutate({ forumId });
    }
  };

  const handleCommentSubmit = () => {
    if (!newcomment.trim() || commentMutation.isPending) return;
    console.log({
      content: newcomment.trim(),
      postId: forumId,
    });

    commentMutation.mutate({
      content: newcomment.trim(),
      postId: forumId,
    });
  };

  // ── Comment item ─────────────────────────────────────────
  const CommentItem = ({ item }) => (
    <View style={styles.commentWrap}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {item?.user?.name?.charAt(0)?.toUpperCase() || "?"}
        </Text>
      </View>
      <View style={styles.commentBubble}>
        <Text style={styles.commentAuthor}>
          {item?.user?.firstName
            ? `${item.user.firstName} ${item.user.lastName || ""}`.trim()
            : item?.user?.name || "User"}
        </Text>
        <Text style={styles.commentContent}>{item?.content}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Post header ──────────────────────── */}
        <View style={styles.postHeader}>
          <Image
            source={{
              uri:
                maindata?.user?.photo ||
                post?.user?.photo ||
                "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg",
            }}
            style={styles.authorAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.authorName}>
              {maindata?.user?.name ||
                post?.user?.name ||
                `${post?.user?.user?.firstName} ${post?.user?.user?.lastName}`}
            </Text>
            <Text style={styles.postDate}>
              {formatDateandTime(post?.createdAt)}
            </Text>
          </View>
          {isOwner && (
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => setModalVisible(true)}
              disabled={deleteMutation.isPending}
            >
              <Entypo name="dots-three-vertical" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Post content ─────────────────────── */}
        <View style={styles.postContent}>
          <Text style={styles.postText}>{post?.content}</Text>
        </View>

        {/* ── Divider ──────────────────────────── */}
        <View style={styles.divider} />

        {/* ── Action bar ───────────────────────── */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              likeMutation.isPending && { opacity: 0.5 },
            ]}
            onPress={handleLike}
            disabled={likeMutation.isPending}
          >
            {likeMutation.isPending ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <AntDesign
                name={isLiked ? "heart" : "hearto"}
                size={22}
                color={isLiked ? "#EF4444" : "#6B7280"}
              />
            )}
            <Text style={[styles.actionText, isLiked && { color: "#EF4444" }]}>
              {post?.likes?.length || 0}{" "}
              {post?.likes?.length === 1 ? "Like" : "Likes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setCommentModalVisible(true)}
          >
            <MaterialCommunityIcons
              name="comment-outline"
              size={22}
              color="#6B7280"
            />
            <Text style={styles.actionText}>
              {post?.comments?.length || 0}{" "}
              {post?.comments?.length === 1 ? "Comment" : "Comments"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ── Comments section ─────────────────── */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>Comments </Text>

          {!post?.comments?.length ? (
            <View style={styles.emptyComments}>
              <LottieView
                autoPlay
                ref={animation}
                style={styles.lottie}
                source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
              />
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySub}>Be the first to comment</Text>
            </View>
          ) : (
            <FlatList
              data={post.comments}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <CommentItem item={item} />}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Floating comment button ──────────── */}
      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => setCommentModalVisible(true)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="comment-plus" size={24} color="#FFFFFF" />
      </TouchableOpacity> */}

      {/* ── Comment modal ────────────────────── */}
      <CenterReuseModals
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalCard}
        >
          {/* Modal header */}
          <View style={styles.modalHeader}>
            <MaterialCommunityIcons
              name="comment-text-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.modalTitle}>Add a Comment</Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setCommentModalVisible(false)}
            >
              <MaterialIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalDivider} />

          <CustomTextArea
            placeholder="Write your comment here..."
            value={newcomment}
            onChangeText={setNewcomment}
            inputStyle={styles.commentInput}
          />

          <Text style={styles.charCount}>{newcomment.length} / 500</Text>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!newcomment.trim() || commentMutation.isPending) &&
                styles.submitBtnDisabled,
            ]}
            onPress={handleCommentSubmit}
            disabled={!newcomment.trim() || commentMutation.isPending}
            activeOpacity={0.85}
          >
            {commentMutation.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="send" size={16} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Post Comment</Text>
              </>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </CenterReuseModals>

      {/* ── Delete modal ─────────────────────── */}
      <ForumModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.deleteModal}>
          <Text style={styles.deleteModalTitle}>Post Options</Text>

          <TouchableOpacity
            style={[
              styles.deleteOption,
              deleteMutation.isPending && { opacity: 0.5 },
            ]}
            onPress={() => {
              if (!deleteMutation.isPending) deleteMutation.mutate({});
            }}
            disabled={deleteMutation.isPending}
          >
            <View style={styles.deleteIconWrap}>
              {deleteMutation.isPending ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={22}
                  color="#EF4444"
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.deleteOptionTitle}>Delete this post</Text>
              <Text style={styles.deleteOptionSub}>
                This post will be permanently deleted
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelOption}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ForumModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { paddingTop: 8 },

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  // Post header
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  authorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
  },
  authorName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  postDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 2,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  // Post content
  postContent: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  postText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
    fontWeight: "400",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 2,
  },

  // Action bar
  actionBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 24,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },

  // Comments section
  commentsSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  commentsSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.2,
    marginBottom: 16,
  },

  // Comment item
  commentWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065F46",
  },
  commentBubble: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    borderTopLeftRadius: 4,
    padding: 12,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  // Empty comments
  emptyComments: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 4,
  },
  lottie: { width: 140, height: 140 },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  emptySub: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  // FAB
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  // Comment modal
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "92%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  commentInput: {
    textAlignVertical: "top",
    padding: 14,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    fontSize: 15,
    minHeight: 110,
    color: "#111827",
  },
  charCount: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 4,
    marginBottom: 16,
    fontWeight: "500",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Delete modal
  deleteModal: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  deleteModalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  deleteOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },
  deleteIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteOptionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
  },
  deleteOptionSub: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 2,
  },
  cancelOption: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },
  cancelText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "600",
  },
});

export default ForumDetails;
