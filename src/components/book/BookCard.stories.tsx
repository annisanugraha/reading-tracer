import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BookCard } from './BookCard';

const meta = {
  component: BookCard,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BookCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MauDibaca: Story = {
  args: {
    judul: 'Laskar Pelangi',
    penulis: 'Andrea Hirata',
    status: 'mau-dibaca',
    totalHalaman: 529,
  },
};

export const SedangDibaca: Story = {
  args: {
    judul: 'Atomic Habits',
    penulis: 'James Clear',
    status: 'sedang-dibaca',
    totalHalaman: 320,
    halamanTerbaca: 145,
    href: '/koleksi/1',
  },
};

export const Selesai: Story = {
  args: {
    judul: 'Sapiens',
    penulis: 'Yuval Noah Harari',
    status: 'selesai',
    rating: 5,
    totalHalaman: 443,
    halamanTerbaca: 443,
    href: '/koleksi/2',
  },
};

export const WithCover: Story = {
  args: {
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX5WWDSGWbxo87Jz_E4v84wgJq-PSjLzNvLLGKZVO3bD6iAjIvHg-_fitO&s=10",
    judul: 'Bumi Manusia',
    penulis: 'Pramoedya Ananta Toer',
    status: 'sedang-dibaca',
    totalHalaman: 535,
    halamanTerbaca: 220,
  },
};
