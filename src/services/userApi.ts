import { baseApi } from '@/store/baseApi';
import type { SubscriptionHistory } from '@/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionHistory: builder.query<SubscriptionHistory[], void>({
      query: () => '/user/subscription-history',
      providesTags: ['Auth'],
    }),
    subscribePackage: builder.mutation<void, { packageId: string }>({
      query: (data) => ({
        url: '/user/subscribe',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    unsubscribePackage: builder.mutation<void, void>({
      query: () => ({
        url: '/user/unsubscribe',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useGetSubscriptionHistoryQuery,
  useSubscribePackageMutation,
  useUnsubscribePackageMutation,
} = userApi;
