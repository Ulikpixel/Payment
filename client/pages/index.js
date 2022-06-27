import Head from 'next/head';
import { TextInput, Button, createStyles, Modal } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import axios from 'axios';
import 'dayjs/locale/ru';
import { useState } from 'react';

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    backgroundImage: 'linear-gradient(to left bottom, violet, red)',
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '300px',
    margin: '0 auto',
    'input': {
      boxShadow: '2px 3px 15px 1px black',
    }
  },
  button: {
    overflow: 'hidden',
    transition: '1s',
    border: 'none',
    margin: '10px 0 0',
    '&:after': {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: '#0d3bae',
      content: '""',
      transition: '1s',
    },
    '&:hover': {
      '&:after': {
        left: 0
      }
    },
    'strong': {
      zIndex: 1,
      fontSize: '16px',
      textTransform: 'uppercase', 
      textShadow: '2px 2px 2px #48577D',
    }
  }
}))

export default function Home() {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: null });
  const form = useForm({
    initialValues: {
      card_number: '',
      date: null,
      cvv: '',
      amount: ''
    },

    validate: {
      card_number: num => (num.length === 16 ? null : 'Card number must be 16 digits'),
      date: date => (date !== null ? null : 'Select a date'),
      cvv: num => (num.length === 3 ? null : 'Cvv must consist of three numbers'),
      amount: num => (num > 0 ? null : 'Enter the amount of money'),
    }
  });

  const format = {
    dateFormat(date) {
      const currentDate = new Date(date);
      const month = currentDate.getMonth() + 1;
      return `${month < 10 ? '0' : ''}${month}/${currentDate.getFullYear()}`;
    },
    onlyNumber(num) {
      return num.replace(/[^\d]/g, "");
    }
  }

  const sendForm = async form => {
    setLoading(true);
    try {
      const body = { ...form, date: format.dateFormat(form.date) };
      const { data: payment } = await axios.post('http://localhost:8080/api/payment', body);
      setModal({ 
        ...modal, 
        open: true, 
        title: <div>
          <p><strong>id</strong> - {payment.request_id}</p>
          <p><strong>amount</strong> - {payment.amount}</p>
        </div>
      });
    } catch (e) {
      setModal({
        ...modal,
        open: true,
        title: <div>
          <h3>Error</h3>
        </div>
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={classes.wrapper}>
      <Head>
        <title>Payment</title>
        <meta name="description" content="Payment" />
      </Head>

      <form className={classes.form} onSubmit={form.onSubmit(sendForm)}>
        <TextInput
          label="Card Number"
          placeholder={Array(16).fill('*').join(' ')}
          onChange={e => form.setFieldValue('card_number', format.onlyNumber(e.currentTarget.value))}
          value={form.values?.card_number}
          maxLength={16}
          error={form.getInputProps('card_number').error}
        />
        <DatePicker
          locale="ru"
          label="Expiration Date"
          value={form.values?.date}
          onChange={date => form.setFieldValue('date', date)}
          inputFormat="MM/YYYY"
          error={form.getInputProps('date').error}
        />
        <TextInput
          label="CVV"
          placeholder="* * *"
          onChange={e => form.setFieldValue('cvv', format.onlyNumber(e.currentTarget.value))}
          value={form.values?.cvv}
          maxLength={3}
          error={form.getInputProps('cvv').error}
        />
        <TextInput
          label="Amount"
          placeholder="Количество счета"
          onChange={e => form.setFieldValue('amount', format.onlyNumber(e.currentTarget.value).replace(/^0+/, ''))}
          value={form.values?.amount}
          error={form.getInputProps('amount').error}
          textShadow='2px 2px 2px #48577D'
        />
        <Button className={classes.button} loading={loading} fullWidth type='submit'>
          <strong>submit</strong>
        </Button>
      </form>
      <Modal
        opened={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        centered={true}
      />
    </div>
  )
}

