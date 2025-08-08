import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Form, FormError } from './ui/Form';
import { API_ENDPOINTS } from '../utils/constants';
import type { CreateStudentRequest, Student } from '../api/types';

// Validation schema
const addStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  grade: z.number().min(1, 'Grade must be at least 1').max(12, 'Grade must be 12 or less'),
});

type AddStudentFormData = z.infer<typeof addStudentSchema>;

export function AddStudent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { server } = useApi();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddStudentFormData>({
    resolver: zodResolver(addStudentSchema),
  });

  // Mutation for creating a student
  const createStudentMutation = useMutation({
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
      // Close modal and reset form
      setIsModalOpen(false);
      reset();
    },
  });

  const onSubmit = async (data: AddStudentFormData) => {
    await createStudentMutation.mutateAsync(data);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
    createStudentMutation.reset();
  };

  return (
    <>
      <Button
        variant="success"
        onClick={() => setIsModalOpen(true)}
        leftIcon={<span>+</span>}
      >
        Add Student
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Add New Student"
        footer={
          <>
            <Button
              type="submit"
              form="add-student-form"
              variant="primary"
              disabled={createStudentMutation.isPending}
              isLoading={createStudentMutation.isPending}
              loadingText="Adding..."
              className="sm:ml-3"
            >
              Add Student
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={createStudentMutation.isPending}
              className="mt-3 sm:mt-0"
            >
              Cancel
            </Button>
          </>
        }
      >
        <Form id="add-student-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('name')}
            label="Student Name"
            placeholder="Enter student name"
            error={errors.name}
          />

          <Input
            {...register('grade', { valueAsNumber: true })}
            type="number"
            label="Grade"
            placeholder="Enter grade (1-12)"
            min="1"
            max="12"
            error={errors.grade}
          />

          {createStudentMutation.isError && (
            <FormError message={createStudentMutation.error?.message || 'Failed to add student'} />
          )}
        </Form>
      </Modal>
    </>
  );
}