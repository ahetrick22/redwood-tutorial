import { MetaTags, useMutation } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  FormError,
  Label,
  Submit,
  SubmitHandler,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { toast, Toaster } from '@redwoodjs/web/toast'
import {
  CreateContactMutation,
  CreateContactMutationVariables,
} from 'types/graphql'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

interface FormValues {
  name: string
  email: string
  message: string
}

const ContactPage = () => {
  const formMethods = useForm({ mode: 'onBlur' })
  const [create, { loading, error }] = useMutation<
    CreateContactMutation,
    CreateContactMutationVariables
  >(CREATE_CONTACT)

  const onSubmit: SubmitHandler<FormValues> = (input) => {
    create({
      variables: { input },
      onCompleted: () => {
        toast.success('Thanks for your submission!')
        formMethods.reset()
      },
    })
  }
  return (
    <>
      <MetaTags title="Contact" description="Contact page" />
      <Toaster />
      <Form onSubmit={onSubmit} error={error} formMethods={formMethods}>
        <FormError error={error} wrapperClassName={'form-error'} />
        <Label name={'name'} errorClassName={'error'}>
          Name
        </Label>
        <TextField
          name={'name'}
          validation={{ required: true }}
          errorClassName={'error'}
        />
        <FieldError name={'name'} className={'error'} />
        <Label name={'email'} errorClassName={'error'}>
          Email
        </Label>
        <TextField
          name={'email'}
          validation={{
            required: true,
            pattern: {
              value: /^[^@]+@[^.]+\..+$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName={'error'}
        />
        <FieldError name={'email'} className={'error'} />
        <Label name={'message'} errorClassName={'error'}>
          Message
        </Label>
        <TextField
          name={'message'}
          validation={{ required: true }}
          errorClassName={'error'}
        />
        <FieldError name={'message'} className={'error'} />
        <Submit disabled={loading}>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
