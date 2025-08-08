import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { StudentsResponse, CreateStudentRequest, Student } from '../api/types';
import { API_ENDPOINTS } from '../utils/constants';

export function useStudents() {
  const { server } = useApi();
  const queryClient = useQueryClient();

  // Fetch students
  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await server.get<StudentsResponse>(API_ENDPOINTS.STUDENTS.LIST);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch students');
    },
  });

  // Create student mutation
  const createStudent = useMutation({
    mutationFn: async (data: CreateStudentRequest) => {
      const response = await server.post<Student>(API_ENDPOINTS.STUDENTS.CREATE, data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to create student');
    },
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    students: studentsQuery.data?.students || [],
    count: studentsQuery.data?.count || 0,
    isLoading: studentsQuery.isLoading,
    error: studentsQuery.error,
    refetch: studentsQuery.refetch,
    createStudent,
  };
}