import { baseApi } from '../store/baseApi';
import type { SubscriptionPackage, ApiResponse } from '../types';

export const packagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query<SubscriptionPackage[], void>({
      query: () => '/admin/packages',
      providesTags: ['Packages'],
    }),
    createPackage: builder.mutation<ApiResponse<SubscriptionPackage>, Partial<SubscriptionPackage>>({
      query: (data) => ({
        url: '/admin/create-package',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Packages'],
    }),
    updatePackage: builder.mutation<ApiResponse<SubscriptionPackage>, { id: string; data: Partial<SubscriptionPackage> }>({
      query: ({ id, data }) => ({
        url: `/admin/packages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Packages'],
    }),
    deletePackage: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/admin/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Packages'],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApi;
