import { baseApi } from '@/store/baseApi';
import type { Folder, FileItem } from '@/types';

export const fileManagerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Folders ──────────────────────────────────────────────────────────────
    getFolders: builder.query<Folder[], void>({
      query: () => '/user/folders',
      transformResponse: (res: { folders: Folder[] }) => res.folders,
      providesTags: ['Folders'],
    }),

    createFolder: builder.mutation<Folder, { name: string }>({
      query: (body) => ({ url: '/user/folders', method: 'POST', body }),
      transformResponse: (res: { folder: Folder }) => res.folder,
      invalidatesTags: ['Folders'],
    }),

    createSubFolder: builder.mutation<Folder, { name: string; parentId: string }>({
      query: (body) => ({ url: '/user/folders/sub', method: 'POST', body }),
      transformResponse: (res: { folder: Folder }) => res.folder,
      invalidatesTags: ['Folders'],
    }),

    deleteFolder: builder.mutation<void, string>({
      query: (id) => ({ url: `/user/folders/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Folders', 'Files'],
    }),

    renameFolder: builder.mutation<Folder, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `/user/folders/${id}/rename`,
        method: 'PATCH',
        body: { name },
      }),
      transformResponse: (res: { folder: Folder }) => res.folder,
      invalidatesTags: ['Folders'],
    }),

    moveFolder: builder.mutation<Folder, { id: string; newParentId: string | null }>({
      query: ({ id, newParentId }) => ({
        url: `/user/folders/${id}/move`,
        method: 'PATCH',
        body: { newParentId },
      }),
      transformResponse: (res: { folder: Folder }) => res.folder,
      invalidatesTags: ['Folders'],
    }),

    // ── Files ───────────────────────────────────────────────────────────────
    getFilesByFolder: builder.query<FileItem[], string>({
      query: (folderId) => `/user/files/folder/${folderId}`,
      transformResponse: (res: { files: FileItem[] }) => res.files,
      providesTags: ['Files'],
    }),

    uploadFile: builder.mutation<FileItem, { folderId: string; file: File }>({
      query: ({ folderId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderId', folderId);
        return { url: '/user/files/upload', method: 'POST', body: formData };
      },
      transformResponse: (res: { file: FileItem }) => res.file,
      invalidatesTags: ['Files'],
    }),

    renameFile: builder.mutation<FileItem, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `/user/files/${id}/rename`,
        method: 'PATCH',
        body: { name },
      }),
      transformResponse: (res: { file: FileItem }) => res.file,
      invalidatesTags: ['Files'],
    }),

    moveFile: builder.mutation<FileItem, { id: string; folderId: string }>({
      query: ({ id, folderId }) => ({
        url: `/user/files/${id}/move`,
        method: 'PATCH',
        body: { folderId },
      }),
      transformResponse: (res: { file: FileItem }) => res.file,
      invalidatesTags: ['Files'],
    }),

    deleteFile: builder.mutation<void, string>({
      query: (id) => ({ url: `/user/files/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Files'],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useCreateSubFolderMutation,
  useDeleteFolderMutation,
  useRenameFolderMutation,
  useMoveFolderMutation,
  useGetFilesByFolderQuery,
  useUploadFileMutation,
  useRenameFileMutation,
  useMoveFileMutation,
  useDeleteFileMutation,
} = fileManagerApi;
