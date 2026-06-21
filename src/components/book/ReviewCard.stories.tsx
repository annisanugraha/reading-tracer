import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ReviewCard } from './ReviewCard';

const meta = {
  component: ReviewCard,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    judul: 'Laskar Pelangi',
    penulis: 'Andrea Hirata',
    rating: 4,
    teksReview:
      'Sebuah novel yang menghangatkan hati tentang perjuangan anak-anak Belitung mengejar mimpi mereka. Narasinya sederhana tapi sangat membekas.',
    tanggal: '2024-12-10T00:00:00.000Z',
    href: '/koleksi/1',
  },
};

export const LongQuote: Story = {
  args: {
    judul: 'Sapiens',
    penulis: 'Yuval Noah Harari',
    rating: 5,
    teksReview:
      'Buku yang mengubah cara saya melihat sejarah umat manusia. Dari revolusi kognitif hingga revolusi teknologi, Harari merangkum ribuan tahun peradaban menjadi narasi yang koheren dan memikat. Sangat direkomendasikan untuk siapa saja yang ingin memahami bagaimana kita sampai di titik ini sebagai spesies, dengan gaya penulisan yang mudah dipahami meskipun materinya berat.',
    tanggal: '2024-08-22T00:00:00.000Z',
    href: '/koleksi/2',
  },
};

export const WithCover: Story = {
  args: {
    cover: 'https://placehold.co/120x180/FF99BE/ffffff?text=BC',
    judul: 'Bumi Cinta',
    penulis: 'Habiburrahman El Shirazy',
    rating: 5,
    teksReview: 'Roman tentang cinta, iman, dan pilihan hidup.',
    tanggal: '2025-01-15T00:00:00.000Z',
  },
};

export const WithoutHref: Story = {
  args: {
    judul: 'Filosofi Teras',
    penulis: 'Henry Manampiring',
    rating: 4,
    teksReview: 'Stoisisme untuk kehidupan modern yang penuh tekanan.',
    tanggal: '2025-02-01T00:00:00.000Z',
  },
};
