/* eslint-disable no-underscore-dangle */
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import rules from '@/utils/rules';
import { CloseCircleOutlined, EyeOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import styles from './block.css';
import Block from './BlockBieuMau';

const FormBieuMau = () => {
  const [form] = Form.useForm();
  const {
    loading,
    record,
    edit,
    postBieuMauAdminModel,
    putBieuMauAdminModel,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    recordQuyTrinh,
  } = useModel('dichvumotcuav2');
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  return (
    <Card title={edit ? 'Chỉnh sửa biểu mẫu' : 'Thêm mới biểu mẫu'}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) {
            putBieuMauAdminModel({
              data: { ...values, quyTrinh: { ...recordQuyTrinh } },
              id: record?._id,
            });
          } else postBieuMauAdminModel({ ...values, quyTrinh: { ...recordQuyTrinh } });
        }}
        form={form}
      >
        <Form.Item
          name="ten"
          label="Tên biểu mẫu"
          initialValue={record?.ten}
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
        >
          <Input placeholder="Tên biểu mẫu" />
        </Form.Item>

        <Form.Item
          name="ghiChu"
          label="Ghi chú"
          initialValue={record?.ghiChu}
          rules={[...rules.text, ...rules.length(200)]}
        >
          <Input.TextArea placeholder="Ghi chú" />
        </Form.Item>

        <Form.List
          name="cauHinhBieuMau"
          initialValue={record?.cauHinhBieuMau ?? []}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 khối'));
                }
                return '';
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <Card
                      headStyle={{ padding: '8px 24px' }}
                      bodyStyle={{ padding: '8px 24px' }}
                      className={styles.block}
                      title={
                        <>
                          <div style={{ float: 'left' }}>Khối {index + 1}</div>
                          <CloseCircleOutlined
                            style={{ float: 'right' }}
                            onClick={() => remove(field.name)}
                          />
                        </>
                      }
                    >
                      <Block fieldName={`cauHinhBieuMau.[${index}]`} field={{ ...field }} />
                    </Card>
                    <br />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Thêm khối
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            );
          }}
        </Form.List>

        <Form.Item style={{ marginBottom: 0, position: 'fixed', top: 14, right: 48 }}>
          <div style={{ display: 'flex' }}>
            {/* <Steps
              style={{ marginRight: 8, minWidth: 300 }}
              current={current}
              onChange={(val) => {
                setCurrent(val);
              }}
            >
              <Steps.Step title="Quy trình" description="" />
              <Steps.Step title="Biểu mẫu" description="" />
            </Steps> */}
            <Button
              icon={<EyeOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => {
                const valueView = form.getFieldsValue(true);
                setRecordView({ thongTinDichVu: { ...valueView } } as DichVuMotCuaV2.Don);
                setVisibleFormBieuMau(true);
              }}
            >
              Xem trước
            </Button>
            <Button
              icon={<SaveOutlined />}
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              {edit ? 'Lưu' : 'Thêm'}
            </Button>
            {/* <Button icon={<CloseOutlined />} onClick={() => setVisibleForm(false)}>
            Đóng
          </Button> */}
          </div>
        </Form.Item>
      </Form>
      <Modal
        destroyOnClose
        width="60%"
        footer={false}
        visible={visibleFormBieuMau}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisibleFormBieuMau(false);
        }}
      >
        <FormView type="view" record={recordView} />
      </Modal>
    </Card>
  );
};

export default FormBieuMau;
