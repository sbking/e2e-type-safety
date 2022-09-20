import { Routes, Route, Navigate } from "react-router-dom";
import AdminEditPost from "./pages/AdminEditPost";
import AdminNewPost from "./pages/AdminNewPost";
import AdminPosts from "./pages/AdminPosts";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { Layout } from "./pages/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="blog" replace />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="admin" element={<Navigate to="posts" replace />} />
        <Route path="admin/posts" element={<AdminPosts />} />
        <Route path="admin/posts/edit/:slug" element={<AdminEditPost />} />
        <Route path="admin/posts/new" element={<AdminNewPost />} />
      </Route>
    </Routes>
  );
}
