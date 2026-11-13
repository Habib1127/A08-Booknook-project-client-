"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api, CATEGORIES, uploadImage } from "@/lib/api";

/**
 * Shared form for adding and editing a book.
 * - mode "add": image file is required
 * - mode "edit": prefilled from `book`; a new image is optional
 */
export default function BookForm({ mode = "add", book, user, onDone, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(book?.image || "");
  const editing = mode === "edit";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const file = form.get("image");
    const hasFile = file && file.size > 0;

    if (!editing && !hasFile) {
      toast.error("Please choose a cover image for the book.");
      return;
    }

    setBusy(true);
    try {
      const image = hasFile ? await uploadImage(file) : book.image;
      const body = {
        title: form.get("title"),
        author: form.get("author"),
        category: form.get("category"),
        totalCopies: Number(form.get("totalCopies")),
        description: form.get("description"),
        image,
      };
      const saved = editing
        ? await api(`/books/${book._id}`, { method: "PATCH", body, auth: true })
        : await api("/books", { method: "POST", body, auth: true });

      toast.success(editing ? "Book updated successfully." : "Book added to the library!");
      if (!editing) {
        formEl.reset();
        setPreview("");
      }
      onDone?.(saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Book Title</span>
        <input name="title" required defaultValue={book?.title} placeholder="e.g. The Midnight Library" className="input input-bordered w-full" />
      </label>
      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Author Name</span>
        <input name="author" required defaultValue={book?.author} placeholder="e.g. Matt Haig" className="input input-bordered w-full" />
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Category</span>
        <select name="category" required defaultValue={book?.category || ""} className="select select-bordered w-full">
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Total Copies</span>
        <input name="totalCopies" type="number" min="1" max="1000" required defaultValue={book?.totalCopies ?? 1} className="input input-bordered w-full" />
      </label>

      <label className="form-control md:col-span-2">
        <span className="mb-1 block text-sm font-medium">
          Book Image {editing && <span className="font-normal opacity-60">(leave empty to keep the current cover)</span>}
        </span>
        <div className="flex items-center gap-4">
          {preview && <img src={preview} alt="Cover preview" className="h-24 w-[72px] rounded-md object-cover" />}
          <input
            name="image"
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
        </div>
      </label>

      <label className="form-control md:col-span-2">
        <span className="mb-1 block text-sm font-medium">Short Description</span>
        <textarea name="description" required rows={4} defaultValue={book?.description} placeholder="What is this book about?" className="textarea textarea-bordered w-full" />
      </label>

      {!editing && (
        <>
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Your Name</span>
            <input value={user?.name || ""} readOnly className="input input-bordered w-full bg-base-200" />
          </label>
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Your Email</span>
            <input value={user?.email || ""} readOnly className="input input-bordered w-full bg-base-200" />
          </label>
        </>
      )}

      <div className="flex justify-end gap-3 md:col-span-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost" disabled={busy}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={busy} className="btn btn-primary min-w-40">
          {busy ? <span className="loading loading-spinner loading-sm" /> : editing ? "Save Changes" : "Add Book"}
        </button>
      </div>
    </form>
  );
}
