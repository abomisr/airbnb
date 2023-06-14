"use client";
import { FieldValues, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

import Modal from './Modal'
import Heading from '../Heading';
import { categories } from '../navbar/Categories';
import useRentModal from '@/app/hooks/useRentModal';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import Counter from '../inputs/Counter';

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const rentModal = useRentModal()
    const [step, setStep] = useState(STEPS.CATEGORY);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            category: "",
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: "",
            price: 1,
            title: "",
            description: ""
        }
    })

    const category = watch("category");
    const location = watch("location");
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import("../Map"), { ssr: false }), [location])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    const onBack = () => {
        setStep(value => value - 1)
    }
    const onNext = () => {
        setStep(value => value + 1)
    }


    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) return "Submit"
        return "Next"
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) return undefined
        return "Back"
    }, [step])

    let bodyContent = [
        (
            <div className="flex flex-col gap-8">
                <Heading title="Which of these best describes your place?" subtitle='Pick a category' />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                    {categories.map((item) => (
                        <div key={item.label} className='col-span-1'>
                            <CategoryInput onClick={(category) => setCustomValue("category", category)} selected={item.label === category} icon={item.icon} label={item.label} />
                        </div>
                    ))}
                </div>
            </div>
        ),
        (
            <div className='flex flex-col gap-8'>
                <Heading title='Where is your place located?' subtitle='Help guests find you!' />
                <CountrySelect
                    onChange={(value) => setCustomValue("location", value)}
                    value={location}
                />
                <Map
                    center={location?.latlng}
                />
            </div>
        ),
        (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your place"
                    subtitle="What amenitis do you have?"
                />
                <Counter
                    onChange={(value) => setCustomValue('guestCount', value)}
                    value={guestCount}
                    title="Guests"
                    subtitle="How many guests do you allow?"
                />
                <hr />
                <Counter
                    onChange={(value) => setCustomValue('roomCount', value)}
                    value={roomCount}
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                />
                <hr />
                <Counter
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                    value={bathroomCount}
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                />
            </div>
        )
    ]

    return (
        <Modal
            title="Airbnb your home!"
            actionLabel={actionLabel}
            onSubmit={onNext}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            body={bodyContent[step]}
        />
    )
}

export default RentModal