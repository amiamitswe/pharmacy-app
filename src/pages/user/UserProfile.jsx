import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Button,
  Input,
  addToast,
} from "@heroui/react";
import { Link } from "react-router";
import userService from "../../api-services/userService";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShoppingCart,
  FaBox,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

    const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.profile();
      if (response.status === 200 && response.data.status) {
        setUser(response.data.user);
        setImagePreview(response.data.user.image_url);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      addToast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        addToast({
          title: "Invalid file",
          description: "Please select an image file",
          color: "danger",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          color: "danger",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await userService.updateProfile(formData);
      if (response.status === 200) {
        addToast({
          title: "Success",
          description: "Profile image updated successfully",
          color: "success",
        });
        // Refresh profile data
        await fetchProfile();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      addToast({
        title: "Upload failed",
        description: error?.response?.data?.message || "Failed to upload image",
        color: "danger",
      });
      // Revert preview on error
      if (user?.image_url) {
        setImagePreview(user.image_url);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900 p-4">
        <CardBody>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Failed to load profile. Please try again.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Profile Header Card */}
      <Card shadow="md" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardBody className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            {/* Profile Image */}
            <div className="relative group shrink-0">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-3 border-white dark:border-gray-800 shadow-lg ring-2 ring-gray-100 dark:ring-gray-700">
                <img
                  src={imagePreview || user.image_url}
                  alt={user.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
                  }}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Spinner size="sm" color="white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 bg-primary text-white rounded-full p-2 sm:p-2.5 shadow-lg hover:bg-primary-600 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ring-2 ring-white dark:ring-gray-800"
                aria-label="Change profile picture"
              >
                <FaCamera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left w-full min-w-0">
              <div className="mb-2 sm:mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  {/* Email Verification Badge - Desktop */}
                  {user.emailVerified !== undefined && (
                    <div className="hidden sm:flex items-center">
                      {user.emailVerified ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                          <FaCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300 whitespace-nowrap">
                            Verified
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
                          <FaTimesCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300 whitespace-nowrap">
                            Unverified
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile: Grid Layout */}
              <div className="grid grid-cols-2 gap-2 sm:hidden mb-3">
                {/* Email - Full Width */}
                <div className="col-span-2 flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <FaEnvelope className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 shrink-0" />
                    {user.emailVerified && (
                      <FaCheckCircle className="w-3.5 h-3.5 text-green-500 dark:text-green-400 shrink-0" title="Email verified" />
                    )}
                  </div>
                  <div className="text-center min-w-0 w-full px-1">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5">Email</p>
                    <p 
                      className="text-xs text-gray-900 dark:text-white break-all word-break break-words" 
                      title={user.email}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Phone - Full Width */}
                <div className="col-span-2 flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <FaPhone className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 shrink-0" />
                  <div className="text-center min-w-0 w-full">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5">Phone</p>
                    <p className="text-xs text-gray-900 dark:text-white">{user.phone}</p>
                  </div>
                </div>

                {/* Email Status - Side by Side with Role */}
                {user.emailVerified !== undefined && (
                  <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    {user.emailVerified ? (
                      <>
                        <FaCheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0" />
                        <div className="text-center min-w-0 w-full">
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5">Status</p>
                          <p className="text-xs font-medium text-green-700 dark:text-green-300">Verified</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                        <div className="text-center min-w-0 w-full">
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5">Status</p>
                          <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Unverified</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Role - Side by Side with Status */}
                <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <FaUser className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 shrink-0" />
                  <div className="text-center min-w-0 w-full">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5">Role</p>
                    <p className="text-xs font-medium text-gray-900 dark:text-white capitalize">
                      {user.role || "User"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop: Original Side-by-Side Layout */}
              <div className="hidden sm:block">
                <div className="flex flex-row sm:items-center gap-2 sm:gap-6 mb-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    <FaEnvelope className="w-4 h-4 shrink-0" />
                    <span className="truncate">{user.email}</span>
                    {user.emailVerified && (
                      <FaCheckCircle className="w-3.5 h-3.5 text-green-500 dark:text-green-400 shrink-0" title="Email verified" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    <FaPhone className="w-4 h-4 shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                </div>
                <div>
                  <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 border border-primary/20 dark:border-primary/30">
                    {user.role?.toUpperCase() || "USER"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card shadow="sm" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/user/shopping-cart">
              <Button
                as="div"
                className="w-full justify-start h-auto py-3 px-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 active:scale-[0.98]"
                radius="lg"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                    <FaShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      Shopping Cart
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {user.cartItemCount || 0} items
                    </p>
                  </div>
                </div>
              </Button>
            </Link>

            <Link to="/user/orders">
              <Button
                as="div"
                className="w-full justify-start h-auto py-3 px-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:border-green-300 dark:hover:border-green-700 active:scale-[0.98]"
                radius="lg"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 shrink-0">
                    <FaBox className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      My Orders
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {user.orderCount || 0} orders
                    </p>
                  </div>
                </div>
              </Button>
            </Link>

            <Link to="/user/address-book">
              <Button
                as="div"
                className="w-full justify-start h-auto py-3 px-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 active:scale-[0.98]"
                radius="lg"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 shrink-0">
                    <FaMapMarkerAlt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      Address Book
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Manage addresses
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card 
          shadow="md" 
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm opacity-90 font-medium">Cart Items</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{user.cartItemCount || 0}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <FaShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 opacity-90" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          shadow="md" 
          className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm opacity-90 font-medium">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{user.orderCount || 0}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <FaBox className="w-6 h-6 sm:w-7 sm:h-7 opacity-90" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          shadow="sm" 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 shrink-0">
                <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Member Since</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-1 truncate">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          shadow="sm" 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 shrink-0">
                <FaEdit className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Last Updated</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-1 truncate">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>


      {/* Account Details */}
      <Card shadow="sm" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Account Details
          </h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Full Name
              </label>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                  <FaUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium truncate">
                  {user.name}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 shrink-0">
                  <FaEnvelope className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium truncate">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Phone Number
              </label>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 shrink-0">
                  <FaPhone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                  {user.phone}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Account Type
              </label>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 shrink-0">
                  <FaUser className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium capitalize">
                  {user.role || "User"}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default UserProfile;
