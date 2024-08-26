from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from flask_marshmallow import Marshmallow
from datetime import date, timedelta
from typing import List
from marshmallow import ValidationError, fields
from sqlalchemy import select, delete
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})



app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/ecom'

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(app, model_class=Base)
ma = Marshmallow(app)

class Customer(Base):
    __tablename__ = "customer"

    id: Mapped[int] = mapped_column(primary_key=True)
    customer_name: Mapped[str] = mapped_column(db.String(75), nullable=False)
    email: Mapped[str] = mapped_column(db.String(150))
    phone: Mapped[str] = mapped_column(db.String(16))

    orders: Mapped[List["Orders"]] = db.relationship("Orders", back_populates='customer')

order_products = db.Table(
    "order_products",
    Base.metadata,
    db.Column('order_id', db.ForeignKey('orders.id'), primary_key=True),
    db.Column('product_id', db.ForeignKey('products.id'), primary_key=True)
)

class Orders(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(primary_key=True)
    order_date: Mapped[date] = mapped_column(db.Date, nullable=False)
    customer_id: Mapped[int] = mapped_column(db.ForeignKey('customer.id'), nullable=False)

    customer: Mapped['Customer'] = db.relationship("Customer", back_populates='orders')
    products: Mapped[List['Products']] = db.relationship("Products", secondary=order_products)

class Products(Base):
    __tablename__ = 'products'

    id: Mapped[int] = mapped_column(primary_key=True)
    product_name: Mapped[str] = mapped_column(db.String(255), nullable=False)
    price: Mapped[float] = mapped_column(db.Float, nullable=False)

class Account(Base):
    __tablename__ = "account"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(db.String(40), nullable=False)
    password: Mapped[str] = mapped_column(db.String(40), nullable=False)
    customer_id: Mapped[int] = mapped_column(db.ForeignKey('customer.id'), nullable=False)

with app.app_context():
    db.create_all()

#================= Marshmallow Data Validation Schema =========================#

class CustomerSchema(ma.Schema):
    id = fields.Integer(required=False)
    customer_name = fields.String(required=True)
    email = fields.String()
    phone = fields.String()

    class Meta:
        fields = ('id', 'customer_name', 'email', 'phone')

class OrderSchema(ma.Schema):
    id = fields.Integer(required=False)
    order_date = fields.Date(required=False)
    customer_id = fields.Integer(required=True)
    items = fields.List(fields.Integer(), required=True)

    class Meta:
        fields = ('id', 'order_date', 'customer_id', 'items')

class ProductSchema(ma.Schema):
    id = fields.Integer(required=False)
    product_name = fields.String(required=True)
    price = fields.Float(required=True)

    class Meta:
        fields = ('id', 'product_name', 'price')

class AccountSchema(ma.Schema):
    id = fields.Integer(required=False)
    username = fields.String(required=True)
    password = fields.String(required=True)
    customer_id = fields.Integer(required=True)

    class Meta:
        fields = ('id', 'username', 'password', 'customer_id')

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

account_schema = AccountSchema()
accounts_schema = AccountSchema(many=True)

@app.route('/')
def home():
    return "Welcome to the E-Commerce Web App!"

#==================== CRUD Operations ==============================================#

#-----------------------Customers-------------------------------

@app.route("/customers", methods=['GET'])
def get_customers():
    query = select(Customer)
    result = db.session.execute(query).scalars()
    customers = result.all()

    return customers_schema.jsonify(customers)

@app.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    query = select(Customer).where(Customer.id == id)
    result = db.session.execute(query).scalars().first()

    if result is None:
        return jsonify({'Error': "Customer not found!"}), 404

    return customer_schema.jsonify(result)

@app.route('/customers', methods=['POST'])
def add_customer():
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_customer = Customer(
        customer_name=customer_data['customer_name'], 
        email=customer_data['email'], 
        phone=customer_data['phone']
    )
    db.session.add(new_customer)
    db.session.commit()

    return jsonify({"Message": "Customer added successfully!"}), 201

@app.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    query = select(Customer).where(Customer.id == id)
    result = db.session.execute(query).scalar()
    if result is None:
        return jsonify({"Error": "Customer not found"}), 404

    customer = result
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    for field, value in customer_data.items():
        setattr(customer, field, value)

    db.session.commit()
    return jsonify({"Message": "Customer details updated!"})

@app.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    query = delete(Customer).where(Customer.id == id)
    result = db.session.execute(query)

    if result.rowcount == 0:
        return jsonify({"Error": "Customer not found"}), 404

    db.session.commit()
    return jsonify({"Message": "Customer successfully deleted!"}), 200

#-------------------------Accounts-------------------------------------------

@app.route('/accounts', methods=['GET'])
def view_accounts():
    query = select(Account)
    result = db.session.execute(query).scalars()
    accounts = result.all()

    return accounts_schema.jsonify(accounts)

@app.route('/accounts/<int:id>', methods=['GET'])
def view_account(id):
    query = select(Account).where(Account.id == id)
    result = db.session.execute(query).scalars().first()

    if result is None:
        return jsonify({'Error': "Account not found!"}), 404

    return account_schema.jsonify(result)

@app.route('/accounts', methods=['POST'])
def add_account():
    try:
        account_data = account_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_account = Account(
        username=account_data['username'], 
        password=account_data['password'],
        customer_id=account_data['customer_id']
    )
    db.session.add(new_account)
    db.session.commit()

    return jsonify({"Message": "Account added successfully!"}), 201

@app.route('/accounts/<int:id>', methods=['PUT'])
def update_account(id):
    query = select(Account).where(Account.id == id)
    result = db.session.execute(query).scalar()
    if result is None:
        return jsonify({"Error": "Account not found"}), 404

    account = result
    try:
        account_data = account_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    for field, value in account_data.items():
        setattr(account, field, value)

    db.session.commit()
    return jsonify({"Message": "Account details updated!"})

@app.route('/accounts/<int:id>', methods=['DELETE'])
def delete_account(id):
    query = delete(Account).where(Account.id == id)
    result = db.session.execute(query)

    if result.rowcount == 0:
        return jsonify({"Error": "Account not found"}), 404

    db.session.commit()
    return jsonify({"Message": "Account successfully deleted!"}), 200

#------------------------------Products-------------------------------------

@app.route('/products', methods=['POST'])
def add_product():
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_product = Products(
        product_name=product_data['product_name'], 
        price=product_data['price']
    )
    db.session.add(new_product)
    db.session.commit()

    return jsonify({"Message": "Product added successfully!"}), 201

@app.route('/products', methods=['GET'])
def get_products():
    query = select(Products)
    result = db.session.execute(query).scalars()
    products = result.all()


    products_list = [
        {"id": product.id, "product_name": product.product_name, "price": product.price}
        for product in products
    ]

    return jsonify(products_list)


@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    query = select(Products).where(Products.id == id)
    result = db.session.execute(query).scalars().first()

    if result is None:
        return jsonify({'Error': "Product not found!"}), 404

    return product_schema.jsonify(result)

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    query = select(Products).where(Products.id == id)
    result = db.session.execute(query).scalar()
    if result is None:
        return jsonify({"Error": "Product not found"}), 404

    product = result
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    for field, value in product_data.items():
        setattr(product, field, value)

    db.session.commit()
    return jsonify({"Message": "Product details updated!"})

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    query = delete(Products).where(Products.id == id)
    result = db.session.execute(query)

    if result.rowcount == 0:
        return jsonify({"Error": "Product not found"}), 404

    db.session.commit()
    return jsonify({"Message": "Product successfully deleted!"}), 200

#--------------------------------Orders-------------------------------------

@app.route('/orders', methods=['POST'])
def add_order():
    try:
        order_data = order_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_order = Orders(
        customer_id=order_data['customer_id'], 
        order_date=date.today()
    )

    for product_id in order_data['items']:
        product = db.session.get(Products, product_id)
        if product:
            new_order.products.append(product)
        else:
            return jsonify({"Error": f"Product with ID {product_id} not found"}), 404

    db.session.add(new_order)
    db.session.commit()

    return jsonify({"Message": "Order created successfully!"}), 201

@app.route('/orders', methods=['GET'])
def get_orders():
    query = select(Orders)
    result = db.session.execute(query).scalars()
    orders = result.all()

    return orders_schema.jsonify(orders)

@app.route('/orders/<int:id>', methods=['GET'])
def get_order(id):
    query = select(Orders).where(Orders.id == id)
    result = db.session.execute(query).scalars().first()

    if result is None:
        return jsonify({'Error': "Order not found!"}), 404

    return order_schema.jsonify(result)

@app.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    query = delete(Orders).where(Orders.id == id)
    result = db.session.execute(query)

    if result.rowcount == 0:
        return jsonify({"Error": "Order not found"}), 404

    db.session.commit()
    return jsonify({"Message": "Order successfully deleted!"}), 200

#=============================================================================================

if __name__ == "__main__":
    app.run(port=5000, debug=True)