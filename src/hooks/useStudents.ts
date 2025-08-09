import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { StudentsResponse, CreateStudentRequest, Student } from '../api/types';
import { API_ENDPOINTS } from '../utils/constants';

interface UseStudentsOptions {
  includeDeleted?: boolean;
}

export function useStudents(options: UseStudentsOptions = {}) {
  const { server } = useApi();
  const queryClient = useQueryClient();
  const { includeDeleted = false } = options;

  // Fetch students
  const studentsQuery = useQuery({
    queryKey: ['students', { includeDeleted }],
    queryFn: async () => {
      const endpoint = includeDeleted 
        ? `${API_ENDPOINTS.STUDENTS.LIST}?include_deleted=true`
        : API_ENDPOINTS.STUDENTS.LIST;
      
      const response = await server.get<StudentsResponse>(endpoint);
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
      // Invalidate and refetch all students queries
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  // Update student mutation
  const updateStudent = useMutation({
    mutationFn: async (student: Student) => {
      const response = await server.put<Student>(API_ENDPOINTS.STUDENTS.LIST, student);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to update student');
    },
    onSuccess: () => {
      // Invalidate and refetch all students queries
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
    // Update student mutation
    const deleteStudent = useMutation({
      mutationFn: async (studentID: number) => {
        const deleteUrl = `${API_ENDPOINTS.STUDENTS.LIST}/${studentID}`;
        const response = await server.delete<Student>(deleteUrl);
        if (response.success) {
          return true;
        }
        throw new Error(response.error?.message || 'Failed to update student');
      },
      onSuccess: () => {
        // Invalidate and refetch all students queries
        queryClient.invalidateQueries({ queryKey: ['students'] });
      },
    });

  return {
    data: studentsQuery.data,
    students: studentsQuery.data?.students || [],
    count: studentsQuery.data?.count || 0,
    isLoading: studentsQuery.isLoading,
    error: studentsQuery.error,
    refetch: studentsQuery.refetch,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}