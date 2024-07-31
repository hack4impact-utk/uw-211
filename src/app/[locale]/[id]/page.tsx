'use client';

import { useState, useEffect } from 'react';
import { SubmitHandler, DeepPartial } from 'react-hook-form';
import { createAgencyInfoWithServices } from '@/server/actions/Agencies';
import { useRouter } from 'next/navigation';
import { AgencyUpdateFormData } from '@/utils/types/agency-update-form';
import {
  formDataToInfo,
  latestInfoToFormData,
} from '@/utils/transformers/agency-info';
import AgencyUpdateForm from '@/components/AgencyUpdateForm';

export default function Form({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [latestInfo, setLatestInfo] = useState<
    DeepPartial<AgencyUpdateFormData> | undefined
  >(undefined);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const getlatestInfo = async () => {
      setInitialLoading(true);
      try {
        const res: Response = await fetch(`../api/agencies/${params.id}`, {
          cache: 'no-store',
        });
        const body = await res.json();
        setLatestInfo(latestInfoToFormData(body.data.agency.latestInfo));
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };

    getlatestInfo();
  }, [params.id]);

  const processForm: SubmitHandler<AgencyUpdateFormData> = async (data) => {
    try {
      setIsLoading(true);
      const validatedInfo = formDataToInfo(data);
      await createAgencyInfoWithServices(params.id, validatedInfo);
      router.push('/complete');

      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    !initialLoading && (
      <AgencyUpdateForm
        defaultValues={latestInfo}
        onSubmit={processForm}
        loading={isLoading}
      />
    )
  );
}
