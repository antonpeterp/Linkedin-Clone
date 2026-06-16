import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav.jsx";
import avatar from "../assets/avatar.png";
import { UserDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { MdLocationOn, MdEdit } from "react-icons/md";
import { FaBriefcase, FaGraduationCap, FaTools } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import EditProfile from "../components/EditProfile.jsx";

const Profile = () => {
  const { userId } = useParams();
  const { userData, setUserData, edit, setEdit } = useContext(UserDataContext);
  const { serverURL } = useContext(authDataContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const isOwnProfile = userData?._id === userId;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${serverURL}/api/user/profile/${userId}`, {
        withCredentials: true,
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const isConnected = userData?.connection?.includes(userId);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/user/connect/${userId}`,
        {},
        { withCredentials: true }
      );
      // update userData connections locally
      setUserData((prev) => ({ ...prev, connection: res.data.connection }));
    } catch (err) {
      console.error("Connect failed:", err);
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#f0efe7] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full min-h-screen bg-[#f0efe7] flex items-center justify-center">
        <div className="text-gray-500 text-sm">User not found.</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f0efe7] pt-[80px] flex flex-col items-center pb-10">
      {edit && <EditProfile />}
      <Nav />

      <div className="w-full max-w-[720px] flex flex-col gap-4 px-4">
        {/* Top card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Cover */}
          <div className="w-full h-[160px] bg-gray-300 overflow-hidden">
            <img
              src={profile.coverImage || ""}
              alt="cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar + name row */}
          <div className="px-6 pb-5 relative">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white absolute -top-[50px]">
              <img
                src={profile.profileImage || avatar}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Edit / Connect button */}
            <div className="flex justify-end pt-3">
              {isOwnProfile ? (
                <button
                  onClick={() => setEdit(true)}
                  className="flex items-center gap-2 border border-blue-600 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-blue-50 transition"
                >
                  <MdEdit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className={`flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-semibold transition ${
                    isConnected
                      ? "border border-gray-400 text-gray-600 hover:bg-gray-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <HiUsers className="w-4 h-4" />
                  {connecting ? "..." : isConnected ? "Connected" : "Connect"}
                </button>
              )}
            </div>

            <div className="mt-10">
              <div className="text-xl font-bold text-gray-900">
                {`${profile.firstName} ${profile.lastName}`}
              </div>
              {profile.headline && (
                <div className="text-sm text-gray-600 mt-1">
                  {profile.headline}
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MdLocationOn className="w-4 h-4" />
                  {profile.location}
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-blue-600 mt-1 font-semibold cursor-pointer">
                <HiUsers className="w-4 h-4" />
                {profile.connection?.length || 0} connections
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-base mb-4">
              <FaBriefcase className="w-5 h-5 text-gray-600" />
              Experience
            </div>
            <div className="flex flex-col gap-4">
              {profile.experience.map((exp, i) => (
                <div
                  key={i}
                  className="flex flex-col border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="font-semibold text-gray-800">{exp.title}</div>
                  <div className="text-sm text-gray-600">{exp.company}</div>
                  {exp.description && (
                    <div className="text-sm text-gray-500 mt-1">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-base mb-4">
              <FaGraduationCap className="w-5 h-5 text-gray-600" />
              Education
            </div>
            <div className="flex flex-col gap-4">
              {profile.education.map((edu, i) => (
                <div
                  key={i}
                  className="flex flex-col border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="font-semibold text-gray-800">
                    {edu.college}
                  </div>
                  <div className="text-sm text-gray-600">
                    {edu.degree}
                    {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-base mb-4">
              <FaTools className="w-5 h-5 text-gray-600" />
              Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Connections */}
        {profile.connection?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-base mb-4">
              <HiUsers className="w-5 h-5 text-gray-600" />
              Connections
            </div>
            <div className="flex flex-wrap gap-4">
              {profile.connection.map((conn) => (
                <div
                  key={conn._id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                  onClick={() => navigate(`/profile/${conn._id}`)}
                >
                  <img
                    src={conn.profileImage || avatar}
                    alt="connection"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {conn.firstName} {conn.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {conn.headline || ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
