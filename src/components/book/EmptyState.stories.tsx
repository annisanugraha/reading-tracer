import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EmptyState } from './EmptyState';

const meta = {
  component: EmptyState,
  tags: ['ai-generated'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Books: Story = {
  args: {
    variant: 'books',
    title: 'Belum ada buku yang sedang dibaca',
    description:
      'Tandai buku sebagai Sedang Dibaca untuk mulai mencatat progress harianmu.',
  },
};

export const Search: Story = {
  args: {
    variant: 'search',
    title: 'Tidak ada hasil yang cocok',
    description: 'Coba kata kunci lain atau hapus beberapa filter.',
  },
};

export const Review: Story = {
  args: {
    variant: 'review',
    title: 'Belum ada review',
    description:
      'Setelah menandai sebuah buku Selesai dan menulis review, ia akan muncul di sini.',
  },
};

export const WithAction: Story = {
  args: {
    variant: 'books',
    title: 'Mulai koleksimu',
    description: 'Tambahkan buku pertama ke ateliermu.',
    action: <button className="btn btn-ink">Tambah Buku</button>,
  },
};
