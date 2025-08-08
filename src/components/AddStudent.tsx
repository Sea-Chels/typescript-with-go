import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UseMutationResult } from '@tanstack/react-query';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Form, FormError } from './ui/Form';
import type { CreateStudentRequest, Student } from '../api/types';

// Validation schema
const addStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  grade: z.number().min(1, 'Grade must be at least 1').max(12, 'Grade must be 12 or less'),
});

type AddStudentFormData = z.infer<typeof addStudentSchema>;

interface AddStudentProps {
  createStudent: UseMutationResult<Student, Error, CreateStudentRequest, unknown>;
}

export function AddStudent({ createStudent }: AddStudentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddStudentFormData>({
    resolver: zodResolver(addStudentSchema),
  });

  const onSubmit = async (data: AddStudentFormData) => {
    await createStudent.mutateAsync(data);
    setIsModalOpen(false);
    reset();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
    createStudent.reset();
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
              disabled={createStudent.isPending}
              isLoading={createStudent.isPending}
              loadingText="Adding..."
              className="sm:ml-3"
            >
              Add Student
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={createStudent.isPending}
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

          {createStudent.isError && (
            <FormError message={createStudent.error?.message || 'Failed to add student'} />
          )}
        </Form>
      </Modal>
    </>
  );
}